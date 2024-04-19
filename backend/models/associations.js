const Contractor = require('./contractor');
const Service = require('./service');
const Host = require('./host');
const Property = require('./property');
const Booking = require('./booking');
const Availability = require('./availability');
const User = require('./user');

// Contractors offer many Services
Contractor.hasMany(Service, { foreignKey: 'contractor_id' });
Service.belongsTo(Contractor, { foreignKey: 'contractor_id' });

// Hosts owns many Properties
Host.hasMany(Property, { foreignKey: 'host_id' });
Property.belongsTo(Host, { foreignKey: 'host_id' });

// Properties have many Bookings
Property.hasMany(Booking, { foreignKey: 'property_id' });
Booking.belongsTo(Property, { foreignKey: 'property_id' });

// Properties have many Availabilities
Property.hasMany(Availability, { foreignKey: 'property_id' });
Availability.belongsTo(Property, { foreignKey: 'property_id' });

// Users make many Bookings
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    Host,
    Property,
    Booking,
    Availability,
    User,
    Contractor,
    Service
};
