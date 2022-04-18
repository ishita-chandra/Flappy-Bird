import Matter from "matter-js"
import Bird from "../components/Bird";
import Floor from "../components/Floor";
import Obstacle from "../components/Obstacle";

import { Dimensions } from 'react-native'
import { getPipeSizePosPair } from "../utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width


export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false })

    let world = engine.world

    engine.gravity.y = 0.4;

    const pipeSizePosA = getPipeSizePosPair()
    const pipeSizePosB = getPipeSizePosPair(windowWidth * 0.9)
    return {
        physics: { engine, world },

        Bird: Bird(world, '#e7e995', { x: 50, y: 300 }, { height: 40, width: 40 }),

        ObstacleTop1: Obstacle(world, 'ObstacleTop1', '#312c31', pipeSizePosA.pipeTop.pos, pipeSizePosA.pipeTop.size),
        ObstacleBottom1: Obstacle(world, 'ObstacleBottom1', '#4b1a4b', pipeSizePosA.pipeBottom.pos, pipeSizePosA.pipeBottom.size),

        ObstacleTop2: Obstacle(world, 'ObstacleTop2', '#312c31', pipeSizePosB.pipeTop.pos, pipeSizePosB.pipeTop.size),
        ObstacleBottom2: Obstacle(world, 'ObstacleBottom2', '#4b1a4b', pipeSizePosB.pipeBottom.pos, pipeSizePosB.pipeBottom.size),

        Floor: Floor(world, 'green', { x: windowWidth / 2, y: windowHeight }, { height: 50, width: windowWidth })
    }
}