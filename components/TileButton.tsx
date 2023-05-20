import { Text, TouchableOpacity, ButtonProps } from 'react-native'
import React from 'react'

const TileButton: React.FC<ButtonProps> = ({ title, onPress }) => (
    <TouchableOpacity style={
        {
            flex: 1,
            height: 60,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderWidth: 1,
        }
    } onPress={onPress} activeOpacity={0.5}>
        <Text>{title}</Text>
    </TouchableOpacity>


)
export default TileButton