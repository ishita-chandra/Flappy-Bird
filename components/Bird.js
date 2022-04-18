import Matter from 'matter-js'
import React from 'react'
import { View, Image } from 'react-native'


const Bird = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody /2
    const yBody = props.body.position.y - heightBody /2

    const color = props.color;

    return(

        
        <View style={{
           //borderWidth: 1,
          // borderRadius: 5,
        //    backgroundSize:"contain",
        //    backgroundRepeat: "no-repeat",
          // backgroundImage: "url(https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Tweety.svg/800px-Tweety.svg.png)",
        //   borderStyle: 'solid',
            position:'relative',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody
        }}>
            <Image style={{position:'absolute',left:0,right:0,top:0,bottom:0,resizeMode:'contain'}}
            
            
            source={{uri:'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Tweety.svg/800px-Tweety.svg.png'}}/>
        </View>
    )
}

export default (world, color, pos, size) => {
   const initialBird = Matter.Bodies.rectangle(
       pos.x,
       pos.y,
       size.width,
       size.height,
       {label: 'Bird'}
   )
   Matter.World.add(world, initialBird)

   return {
       body: initialBird,
       color,
       pos,
       renderer: <Bird/>
   }
}
