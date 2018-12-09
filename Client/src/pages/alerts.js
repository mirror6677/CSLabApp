import React from 'react'
import { connect } from 'dva'
import { Card, Divider, Icon } from 'antd'
import styles from './alerts.css'
import ALERT_CATEGORIES from '../constants/alert_categories'
import moment from 'moment'
import RegradeModal from '../components/RegradeModal'

const { Meta } = Card

class Alerts extends React.PureComponent {

  state = {
    showModal: false,
    currAlert: null
  }

  openModal = alert => {
    this.setState({
      showModal: true,
      currAlert: alert
    })
    this.props.dispatch({
      type: 'alerts/updateAlert',
      payload: {
        data: {
          ...alert,
          read: true
        }
      }
    })
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      currAlert: null
    })
  }

  render() {
    const { alerts } = this.props
    const { showModal, currAlert } = this.state

    return (
      <div>
        { alerts && alerts.map(alert => (
          <div key={alert._id}>
            <Card
              bordered={false}
              className={alert.read ? styles.card : styles.card_unread}
              onClick={() => this.openModal(alert)}
            >
              <Meta
                avatar={ <Icon type="exception" /> }
                title={ <div className={styles.alert_title}>
                  <span>{ALERT_CATEGORIES[alert.category].value}</span>
                  <span>{moment(alert.date_created).fromNow()}</span>
                </div> }
                description={alert.message}
              />
            </Card>
            <Divider style={{ margin: 0, padding: 0 }} />
          </div>
        )) }
        { showModal && <RegradeModal visible={showModal} alert={currAlert} onClose={this.closeModal} /> }
      </div>
    )
  }
}

export default connect(({ alerts }) => ({
  alerts
}))(Alerts)