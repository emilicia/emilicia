import { router, Tabs } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function AppLayout() {

    const handleLogOut = () => {
        router.replace('../../')
    }

    return (
        <Tabs
            screenOptions = {{
                tabBarStyle: {
                    backgroundColor: '#FFF',
                    paddingTop: 15,
                    paddingBottom: 15,
                    height: 80
                },
                headerStyle: {
                    backgroundColor: '#1B73B4',
                },
                headerTintColor: 'white',
                tabBarActiveTintColor: '#1B73B4',
                tabBarInactiveTintColor: 'gray'
            }}
        >

            <Tabs.Screen
                name = 'Position'
                options = {{
                    title: 'Position',
                    tabBarIcon: ({ color, focused }) => (
                        <Entypo name="location" size={24} color= { color } />
                    )
                }}
            />

            <Tabs.Screen
                name = 'Equipment'
                options = {{
                    title: 'Equipement',
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesome5 name="toolbox" size={24} color= { color } />
                    )
                }}
            />

            <Tabs.Screen
                name = 'Renting'
                options = {{
                    title: 'Location',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name = "list-alt" size = { 24 } color = { color } />
                    )
                }}
            />

            <Tabs.Screen
                name = 'Profile'
                options = {{
                    title: 'Profil',
                    tabBarIcon: ({ color, focused }) => (
                        <AntDesign name="user" size={24} color={ color } />
                    )
                }}
            />

        </Tabs>
    )
}

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginRight: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 15
    }
})

// #1B73B4
// #3eb59d
// #42ab49