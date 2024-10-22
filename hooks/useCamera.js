import * as ImagePicker from 'expo-image-picker'

export default async function useCamera( saveImage ){
    try {
        await ImagePicker.requestCameraPermissionsAsync()
        let result = ImagePicker.launchCameraAsync({
            cameraType: ImagePicker.CameraType.back,
            allowsEditing: true,
            aspect: [ 1, 1 ],
            quality: 1
        })

        if(!(await result).canceled){
            // save the image
            await saveImage((await result).assets[0].uri)
        }
    } catch (error) {
        throw error
    }
}