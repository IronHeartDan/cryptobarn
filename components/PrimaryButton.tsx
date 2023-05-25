import { Text, ButtonProps, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const PrimaryButton: React.FC<ButtonProps> = ({ onPress, title }) => {
    return (
        <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.btntxt}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        width: "100%",
        marginVertical: 5,
        backgroundColor: "black",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
    },
    btntxt: {
        color: "white",
        textAlign: "center",
    }
})


export default PrimaryButton