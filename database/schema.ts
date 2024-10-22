import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

// users
export const users = sqliteTable('users', {
    userId: integer('userId').primaryKey(),
    userName: text('userName').default(''),
    userType: text('userType').default('client'),
    userImageUrl: text('userImageUrl').default(''),
    userEmail: text('userEmail').notNull(),
    userPassword: text('userPassword').notNull(),
});

// positions
export const positions = sqliteTable('positions', {
    positionId: integer('positionId').primaryKey(),
    positionName: text('positionName').default(''),
    positionLocation: text('positionLocation').default(''),
    positionCapacity: integer('positionCapacity').default(0),
    positionDailyRenting: real('positionDailyRenting').default(0),
    positionAvailable: integer('positionAvailable').default(1),
    positionImageUrl: text('positionImageUrl').default(''),
});

// equipment
export const equipments = sqliteTable('equipments', {
    equipmentId: integer('equipmentId').primaryKey(),
    equipmentName: text('equipmentName').default(''),
    equipmentAmount: text('equipmentAmount').default(''),

    positionId: integer('positionId')
});

// renting
export const rentings = sqliteTable('rentings', {
    rentingId: integer('rentingId').primaryKey(),
    rentingStartDate: text('rentingStartDate').notNull().default(sql`CURRENT_TIMESTAMP`),
    rentingEndDate: text('rentingEndDate').notNull().default(sql`CURRENT_TIMESTAMP`),
    rentingStatus: text('rentingStatus').default('nouvelle'),

    userId: integer('userId'),
    positionId: integer('positionId')
});


// rentings relations
export const rentingsRelations = relations( rentings, ({ one }) => ({
    user: one( users, { fields: [ rentings.userId ], references: [ users.userId ]}),
    position: one( positions, { fields: [ rentings.positionId ], references: [ positions.positionId ]})
}))


// users relations
export const usersRelations = relations( users, ({ many }) => ({
    rentings: many( rentings )
}))

// positions relations
export const positionsRelations = relations( positions, ({ many }) => ({
    equipments: many( equipments ),
    rentings: many( rentings )
}))

// equipments relations
export const equipmentsRelations = relations( equipments, ({ one }) => ({
    position: one( positions, { fields: [ equipments.positionId ], references: [ positions.positionId ]})
}))


// clients
export const clients = sqliteTable('clients', {
    clientId: integer('clientId').primaryKey(),
    clientName: text('clientName').notNull(),
    clientAddress: text('clientAddress').notNull(),
    clientContact: text('clientContact').notNull(),
    pseudo: text('pseudo').notNull(),
});

// products
export const products = sqliteTable('products', {
    productId: integer('productId').primaryKey(),
    productName: text('productName'),
    productReference: text('productReference'),
    productUP: real('productUP'),
    productStock: integer('productStock')
})

// products
export const salesPersons = sqliteTable('salesPersons', {
    salesPersonId: integer('salesPersonId').primaryKey(),
    salesPersonName: text('salesPersonName'),
    salesPersonContact: text('salesPersonContact')
})

// sales
export const sales = sqliteTable('sales', {
    salesId: integer('salesId').primaryKey(),
    salesDate: text('salesDate').notNull().default(sql`CURRENT_TIMESTAMP`),
    salesAmount: real('salesAmount'),
    productId: real('productId'),
    clientId: real('clientId'),
    salesPersonId: real('salesPersonId'),
})

// sales relations
export const salesRelations = relations( sales, ({ one }) => ({
    product: one( products, { fields: [ sales.productId ], references: [ products.productId ]}),
    client: one( clients, { fields: [ sales.clientId ], references: [ clients.clientId ]}),
    salesPerson: one( salesPersons, { fields: [ sales.salesPersonId ], references: [ salesPersons.salesPersonId ]}),
}))

// product relations
export const productsRelations = relations( products, ({ many }) => ({
    sales: many( sales )
}))

// client relations
export const clientsRelations = relations( clients, ({ many }) => ({
    sales: many( sales )
}))

// salesPerson relations
export const salesPersonsRelations = relations( salesPersons, ({ many }) => ({
    sales: many( sales )
}))