import { StyleSheet } from 'react-native';

const globalStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        width: "100%",
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
    },
    logo: {
        fontFamily: 'RobotoMono',
        fontSize: 32,
        fontWeight: '500',
        textAlign: 'center',
    },
})

export default globalStyle