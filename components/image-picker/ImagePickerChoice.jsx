import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ImagePickerChoice({ visible, setVisible, uploadImageFromCamera, uploadImageFromGallery }){

    const closeModal = () => setVisible(false)

    return(
        <Modal
            transparent
            visible = { visible }
            onTouchCancel = { closeModal }
        >
            <Pressable style = { styles.layer }>
                <View style = { styles.choiceContainer }>

                    <Pressable onPress = { closeModal } style = { styles.closeButton }>
                        <AntDesign name="closecircle" size={24} color="gray" />
                    </Pressable>

                    <Pressable style = { styles.choice } onPress = { uploadImageFromCamera }>
                        <EvilIcons name="camera" size={30} color="#1B73B4" />
                        <Text style = { styles.choiceText }> Caméra </Text>
                    </Pressable>

                    <Pressable style = { styles.choice } onPress = { uploadImageFromGallery }>
                        <Entypo name="image" size={24} color="#1B73B4" />
                        <Text style = { styles.choiceText }> Gallery </Text>
                    </Pressable>

                </View>
            </Pressable>
        </Modal>
    )
}


const styles = StyleSheet.create({
    layer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(100, 100, 100, .4)'
    },
    choiceContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        flexDirection: 'row',
        paddingHorizontal: 40,
        paddingVertical: 30,
        gap: 30,
        position: 'relative'
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5
    },
    choice: {
        borderColor: '#1B73B4',
        borderWidth: 1,
        backgroundColor: 'rgba(215, 152, 244, 0.2)',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    choiceText: {
        color: '#1B73B4'
    }

})