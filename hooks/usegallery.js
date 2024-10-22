import * as ImagePicker from 'expo-image-picker' 

export default async function useGallery ( saveImage ) {
    try {
        await ImagePicker.requestMediaLibraryPermissionsAsync()
        let result = ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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