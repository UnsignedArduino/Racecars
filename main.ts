function make_car (up_image: Image, right_image: Image, down_image: Image, left_image: Image) {
    sprite_car = sprites.create(up_image, SpriteKind.Player)
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
function make_map () {
    scene.setBackgroundColor(7)
    tiles.setTilemap(tilemap`map`)
    starting_tile = assets.tile`upward_start`
    for (let location of tiles.getTilesByType(sprites.builtin.forestTiles0)) {
        tiles.setWallAt(location, true)
    }
}
let driving_enabled = false
let sprite_car: Sprite = null
let starting_tile: Image = null
let sprite_player: Sprite = null
let player_speed = 0
player_speed = 150
make_map()
sprite_player = make_car(assets.image`red_car_up`, assets.image`red_car_right`, assets.image`red_car_down`, assets.image`red_car_left`)
enable_driving(true)
scene.cameraFollowSprite(sprite_player)
tiles.placeOnRandomTile(sprite_player, starting_tile)
