namespace SpriteKind {
    export const Checkpoint = SpriteKind.create()
    export const AI = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Checkpoint, function (sprite, otherSprite) {
    update_last_checkpoint(sprite)
    sprites.changeDataNumberBy(sprite, "checkpoints_obtained", 1)
    sprite.startEffect(effects.halo, 5000)
    otherSprite.destroy()
    timer.background(function () {
        Notification.waitForNotificationFinish()
        Notification.notify("Checkpoint " + sprites.readDataNumber(sprite, "checkpoints_obtained") + "/" + checkpoint_count + " obtained! ", 1, assets.image`mini_checkpoint_flag`)
    })
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    scene.cameraShake(2, 100)
})
function make_car (up_image: Image, right_image: Image, down_image: Image, left_image: Image, _type: number) {
    sprite_car = sprites.create(up_image, _type)
    character.runFrames(
    sprite_car,
    [up_image],
    100,
    character.rule(Predicate.MovingUp)
    )
    character.runFrames(
    sprite_car,
    [right_image],
    100,
    character.rule(Predicate.MovingRight)
    )
    character.runFrames(
    sprite_car,
    [down_image],
    100,
    character.rule(Predicate.MovingDown)
    )
    character.runFrames(
    sprite_car,
    [left_image],
    100,
    character.rule(Predicate.MovingLeft)
    )
    update_last_checkpoint(sprite_car)
    sprites.setDataNumber(sprite_car, "checkpoints_obtained", 0)
    return sprite_car
}
function enable_driving (en: boolean, speed_multiplier: number) {
    driving_enabled = en
    if (en) {
        controller.moveSprite(sprite_player, player_speed * speed_multiplier, player_speed * speed_multiplier)
    } else {
        controller.moveSprite(sprite_player, 0, 0)
    }
}
function make_ai_car () {
    sprite_car = make_car(assets.image`red_car_up`, assets.image`red_car_right`, assets.image`red_car_down`, assets.image`red_car_left`, SpriteKind.AI)
    tiles.placeOnRandomTile(sprite_car, starting_tile)
    tiles.setTileAt(tiles.locationOfSprite(sprite_car), assets.tile`upward_start_used`)
}
function make_forest_map () {
    scene.setBackgroundColor(7)
    tiles.setTilemap(tilemap`map`)
    starting_tile = assets.tile`upward_start`
    for (let location of tiles.getTilesByType(sprites.builtin.forestTiles0)) {
        tiles.setWallAt(location, true)
    }
    initialize_checkpoints()
}
function is_on_road (car: Sprite) {
    for (let tiles2 of [
    assets.tile`center_road`,
    assets.tile`upward_start`,
    assets.tile`upward_start_used`,
    assets.tile`finish_line`,
    assets.tile`left_side_road`,
    assets.tile`right_side_road`,
    assets.tile`top_side_road`,
    assets.tile`bottom_side_road`,
    assets.tile`top_left_corner_road`,
    assets.tile`top_right_corner_road`,
    assets.tile`bottom_right_corner_road`,
    assets.tile`bottom_left_corner_road`
    ]) {
        if (car.tileKindAt(TileDirection.Center, tiles2)) {
            return true
        }
    }
    return false
}
function sprite_overlapping_kind (target: Sprite, kind: number) {
    for (let sprite of sprites.allOfKind(kind)) {
        if (target.overlapsWith(sprite)) {
            return true
        }
    }
    return false
}
function initialize_checkpoints () {
    checkpoint_count = tiles.getTilesByType(assets.tile`center_road_checkpoint`).length
    for (let location of tiles.getTilesByType(assets.tile`center_road_checkpoint`)) {
        sprite_checkpoint = sprites.create(assets.image`checkpoint_flag`, SpriteKind.Checkpoint)
        tiles.placeOnTile(sprite_checkpoint, location)
        tiles.setTileAt(location, assets.tile`center_road`)
    }
}
function make_player () {
    sprite_player = make_car(assets.image`red_car_up`, assets.image`red_car_right`, assets.image`red_car_down`, assets.image`red_car_left`, SpriteKind.Player)
    enable_driving(true, 1)
    scene.cameraFollowSprite(sprite_player)
    tiles.placeOnRandomTile(sprite_player, starting_tile)
    update_last_checkpoint(sprite_player)
    tiles.setTileAt(tiles.locationOfSprite(sprite_player), assets.tile`upward_start_used`)
}
function get_last_checkpoint (car: Sprite) {
    return tiles.getTileLocation(sprites.readDataNumber(car, "last_checkpoint_col"), sprites.readDataNumber(car, "last_checkpoint_row"))
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`finish_line`, function (sprite, location) {
    timer.throttle("check_win", 2000, function () {
        if (sprites.readDataNumber(sprite, "checkpoints_obtained") == checkpoint_count) {
            enable_driving(false, 1)
            sprite.vy = player_speed * -1
            sprite.vx = 0
            timer.after(100, function () {
                scene.cameraFollowSprite(null)
            })
            timer.after(2000, function () {
                game.over(true)
            })
        }
    })
})
function update_last_checkpoint (car: Sprite) {
    sprites.setDataNumber(car, "last_checkpoint_col", tiles.locationXY(tiles.locationOfSprite(car), tiles.XY.column))
    sprites.setDataNumber(car, "last_checkpoint_row", tiles.locationXY(tiles.locationOfSprite(car), tiles.XY.row))
}
let sprite_checkpoint: Sprite = null
let starting_tile: Image = null
let sprite_player: Sprite = null
let driving_enabled = false
let sprite_car: Sprite = null
let checkpoint_count = 0
let player_speed = 0
player_speed = 150
let in_game = false
let ai_car_count = 15
make_forest_map()
make_player()
for (let index = 0; index < ai_car_count; index++) {
    make_ai_car()
}
for (let location of tiles.getTilesByType(assets.tile`upward_start`)) {
    tiles.setTileAt(location, assets.tile`upward_start_used`)
}
in_game = true
game.onUpdateInterval(100, function () {
    if (in_game) {
        if (is_on_road(sprite_player)) {
            enable_driving(true, 1)
        } else {
            enable_driving(true, 0.6)
            if (character.matchesRule(sprite_player, character.rule(Predicate.Moving))) {
                sprite_player.startEffect(effects.spray, 100)
            }
        }
    }
})
