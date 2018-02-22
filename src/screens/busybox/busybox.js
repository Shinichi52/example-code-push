import React, { Component } from 'react';
import { View, Text, Dimensions, ImageBackground } from 'react-native';
import background from '../../img/splash.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBarLight from '../../modules/_global/ProgressBar';

const { height, width } = Dimensions.get('window');
export class BusyBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratio: 0,
            percent: 0
        }
    }
    render() {
        return (
            <View style={{
                width: width,
                height: height,
                backgroundColor: 'transparent'
            }}>
                <ImageBackground source={background} style={{ flex: 1, width: null, height: null, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <View style={{
                            backgroundColor: 'transparent',
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ProgressBarLight />
                        </View>
                        {
                            this.props.isUpdating ? (<View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[{ color: '#FFF', marginBottom: 4, textAlign: 'center' }]}>{`Updating...`}</Text>
                            </View>) : (<Text style={[{ color: '#FFF', marginBottom: 4, textAlign: 'center' }]}>{'Connecting...'}</Text>)
                        }
                    </View>
                </ImageBackground>
            </View>
        )
    }
}
export default BusyBox;
