import { Image, Modal, StyleSheet, Text, View } from "react-native";

export default function Loading({ visible }){
    return(
        <Modal
            transparent
            visible = { visible }
            style = { styles.loadingPage }
            animationType="fade"
        >
            <View style = { styles.layer }>
                <View style = { styles.loadingContainer }>
                    <Text style = { styles.text }>Veuillez patienter...</Text>
                    <Image
                        source = {
                            require('../../assets/images/loading.gif')
                        }
                        style = { styles.image }
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    loadingPage: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    layer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        gap: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    text: {
        color: '#1B73B4',
        fontSize: 18,
        fontWeight: 'bold'
    },
    image: {
        width: 180,
        height: 180,
    }
})