export default function (sequelize, Sequelize) {
  const Content = sequelize.define('Content', {
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
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'content'
  })
  return Content
}
