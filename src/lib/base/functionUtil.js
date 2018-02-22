import deviceLog from 'react-native-device-log';

export function logDevice(type, message, data) {
    try {
        // log - debug - info - error - fatal - success
        if (deviceLog[type]) {
            data ? deviceLog[type](message, data) : deviceLog[type](message)
            // console.log(message);
        }
    } catch (error) {
        try {
            deviceLog.error('Error when write log: ', error)
        } catch (error1) {
            console.warn(error1);
        }
    }
}
export function name(params) {

}