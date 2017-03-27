module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('content', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      resolved_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      html: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('content')
  }
}
