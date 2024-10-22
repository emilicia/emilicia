import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from '@/database/schema'
import { and, eq, gt, gte, lte, sql } from "drizzle-orm";
import { Alert } from "react-native";
const { createContext, useState } = require("react");
import * as SecureStore from 'expo-secure-store'

const Context = createContext()

export const ContextProvider = ({ children }) => {

    const database = useSQLiteContext()
    const db = drizzle( database, { schema: schema })

    const [ user, setUser ] = useState({})

    const getUser = async () => {
      const userStringData = await SecureStore.getItemAsync('user')
      setUser(JSON.parse(userStringData))
    }

    const createAdmin = async () => {
      const admins = await db.select().from(schema.users).where(
        eq(schema.users.userType, 'admin')
      )
      if( admins.length == 0 ){
        const admin = await db.insert(schema.users).values({
          userName: 'admin',
          userEmail: 'admin@gmail.com',
          userPassword: 'admin',
          userType: 'admin'
        })
      }
    }

    const [ positions, setPositions ] = useState([])
    const [ currentPosition, setCurrentPosition ] = useState({})

    const getPositions = async _ => {
      try {
        const res = await db.query.positions.findMany({
          with: {
            equipments: true
          }
        })
        setPositions(res)
      } catch (error) {
        console.log(error)
      }
    }

    const [ equipments, setEquipments ] = useState([])
    const [ currentEquipment, setCurrentEquipment ] = useState({})

    const getEquipments = async _ => {
      try {
        const res = await db.query.equipments.findMany({
          with: {
            position: true
          }
        })
        setEquipments(res)
      } catch (error) {
        console.log(error)
      }
    }

    const [ rentings, setRentings ] = useState([])
    const [ currentRenting, setCurrentRenting ] = useState({})

    const getRentings = async _ => {
      try {
        const res = await db.query.rentings.findMany({
          with: {
            user: true,
            position: true
          }
        })
        setRentings(res)
      } catch (error) {
        console.log(error)
      }
    }

    const [ users, setUsers ] = useState([])
    const [ currentUser, setCurrentUser ] = useState({})

    const getUsers = async _ => {
      try {
        const res = await db.query.users.findMany()
        setUsers(res)
      } catch (error) {
        console.log(error)
      }
    }


    const updateRentings = async _ => {
      try {
        await db
          .update(schema.rentings)
          .set({rentingStatus: 'en cours'})
          .where( and(
            gte( sql`CURRENT_TIMESTAMP`, schema.rentings.rentingStartDate ),
            lte( sql`CURRENT_TIMESTAMP`, schema.rentings.rentingEndDate )
          ))

        await db
          .update(schema.rentings)
          .set({rentingStatus: 'terminée'})
          .where( gt( sql`CURRENT_TIMESTAMP`, schema.rentings.rentingEndDate ))

      } catch (error) {
        Alert.alert('Echec de la mise à jour des location')
      }
    }






    const [ products, setProducts ] = useState([])
    const [ currentProduct, setCurrentProduct ] = useState({})

    const getProducts = async _ => {
      try {
        const res = await db.query.products.findMany()
        setProducts(res)
      } catch (error) {
        console.log(error)
      }
    }

    const [ salesPersons, setSalesPersons ] = useState([])
    const [ currentSalesPerson, setCurrentSalesPerson ] = useState({})

    const getSalesPersons = async _ => {
      try {
        const res = await db.query.salesPersons.findMany()
        setSalesPersons(res)
      } catch (error) {
        console.log(error)
      }
    }

    const [ clients, setClients ] = useState([])
    const [ currentClient, setCurrentClient ] = useState({})

    const getClients = async _ => {
      try {
        const res = await db.query.clients.findMany()
        setClients(res)
      } catch (error) {
        console.log(error)
      }
    }

    const [ sales, setSales ] = useState([])
    const [ currentSale, setCurrentSale ] = useState({})

    const getSales = async _ => {
      try {
        const res = await db.query.sales.findMany({
          with: {
            product: true,
            client: true,
            salesPerson: true
          }
        })
        setSales(res)
      } catch (error) {
        console.log(error)
      }
    }

    return(
        <Context.Provider value = {{
            // db
            db,

            // positions
            getPositions,
            positions,
            currentPosition,
            setCurrentPosition,

            // equipments
            getEquipments,
            equipments,
            currentEquipment,
            setCurrentEquipment,

            // rentings
            getRentings,
            rentings,
            currentRenting,
            setCurrentRenting,
            updateRentings,

            // users
            getUsers,
            users,
            currentUser,
            setCurrentUser,

            // user
            getUser,
            user,
            setUser,

            // create admin
            createAdmin,




            // products
            getProducts,
            products,
            currentProduct,
            setCurrentProduct,

            // salespersons
            getSalesPersons,
            salesPersons,
            currentSalesPerson,
            setCurrentSalesPerson,

            // cleints
            getClients,
            clients,
            currentClient,
            setCurrentClient,

            // sales
            getSales,
            sales,
            currentSale,
            setCurrentSale,
        }}>
            { children }
        </Context.Provider>
    )
}

export default Context