import * as Clipboard from 'expo-clipboard';
import { Alert, AlertButton, AlertOptions } from 'react-native';


const showAlert = (title: string, message?: string | undefined, buttons?: AlertButton[] | undefined, options?: AlertOptions | undefined) => {
    Alert.alert(
        title,
        message,
        buttons,
        options
    );
}


const handleCopyToClipboard = async (text: string) => {
    try {
        await Clipboard.setStringAsync(text)
        return true
    } catch (error) {
        return false
    }
}


export { showAlert, handleCopyToClipboard }