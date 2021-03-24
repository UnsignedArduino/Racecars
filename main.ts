namespace SpriteKind {
    export const Checkpoint = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Checkpoint, function (sprite, otherSprite) {
    update_last_checkpoint(sprite)
    sprites.changeDataNumberBy(sprite, "checkpoints_obtained", 1)
    sprite.startEffect(effects.halo, 5000)
    otherSprite.destroy()
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
function enable_driving (en: boolean) {
    driving_enabled = en
    if (en) {
        controller.moveSprite(sprite_player, player_speed, player_speed)
    } else {
        controller.moveSprite(sprite_player, 0, 0)
    }
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
function initialize_checkpoints () {
    checkpoint_count = tiles.getTilesByType(assets.tile`center_road_checkpoint`).length
    tiles.coverAllTiles(assets.tile`center_road_checkpoint`, assets.tile`center_road`)
    for (let location of tiles.getTilesByType(assets.tile`center_road_checkpoint`)) {
        sprite_checkpoint = sprites.create(assets.image`checkpoint_flag`, SpriteKind.Checkpoint)
        tiles.placeOnTile(sprite_checkpoint, location)
    }
}
function get_last_checkpoint (car: Sprite) {
    return tiles.getTileLocation(sprites.readDataNumber(car, "last_checkpoint_col"), sprites.readDataNumber(car, "last_checkpoint_row"))
}
function update_last_checkpoint (car: Sprite) {
    sprites.setDataNumber(car, "last_checkpoint_col", tiles.locationXY(tiles.locationOfSprite(car), tiles.XY.column))
    sprites.setDataNumber(car, "last_checkpoint_row", tiles.locationXY(tiles.locationOfSprite(car), tiles.XY.row))
}
let sprite_checkpoint: Sprite = null
let checkpoint_count = 0
let driving_enabled = false
let sprite_car: Sprite = null
let starting_tile: Image = null
let sprite_player: Sprite = null
let player_speed = 0
player_speed = 150
make_forest_map()
sprite_player = make_car(assets.image`red_car_up`, assets.image`red_car_right`, assets.image`red_car_down`, assets.image`red_car_left`, SpriteKind.Player)
enable_driving(true)
scene.cameraFollowSprite(sprite_player)
tiles.placeOnRandomTile(sprite_player, starting_tile)
update_last_checkpoint(sprite_player)
