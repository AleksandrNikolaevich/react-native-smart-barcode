/*
 * A smart barcode scanner for react-native apps
 * https://github.com/react-native-component/react-native-smart-barcode/
 * Released under the MIT license
 * Copyright (c) 2016 react-native-component <moonsunfall@aliyun.com>
 */


import React, {
    PropTypes,
    Component,
} from 'react'
import {
    View,
    requireNativeComponent,
    NativeModules,
    AppState,
    Platform,
    PermissionsAndroid
} from 'react-native'

const BarcodeManager = Platform.OS == 'ios' ? NativeModules.Barcode : NativeModules.CaptureModule


export default class Barcode extends Component {

    static defaultProps = {
        barCodeTypes: Object.values(BarcodeManager.barCodeTypes),
        scannerRectWidth: 255,
        scannerRectHeight: 255,
        scannerRectTop: 0,
        scannerRectLeft: 0,
        scannerLineInterval: 3000,
        scannerRectCornerColor: `#09BB0D`,
    }


    render() {
        return (
            <NativeBarCode
                {...this.props}
            />
        )
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this.startScan();
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }


    requestCameraPermission = async () => {
        if(Platform.OS === "ios") return true;
        try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
           return true
          } else {
            return false
          }
        } catch (err) {
            return false
        }
    }

    startScan() {
        this.requestCameraPermission().then(allowed=>{
            allowed && BarcodeManager.startSession();
        }).catch(e=>alert(e))
        
    }

    stopScan() {
        BarcodeManager.stopSession()
    }

    _handleAppStateChange = (currentAppState) => {
        if(currentAppState !== 'active' ) {
            this.stopScan()
        }
        else {
            this.startScan()
        }
    }
}

const NativeBarCode = requireNativeComponent(Platform.OS == 'ios' ? 'RCTBarcode' : 'CaptureView', Barcode)
