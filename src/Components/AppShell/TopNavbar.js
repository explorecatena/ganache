import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import connect from '../Helpers/connect'
import * as Search from '../../Actions/Search'
import { setSystemError } from '../../Actions/Core'

import Spinner from '../../Elements/Spinner'
import OnlyIf from '../../Elements/OnlyIf'
import StatusIndicator from '../../Elements/StatusIndicator'

import AccountIcon from '../../Elements/icons/account.svg'
import BlockIcon from '../../Elements/icons/blocks.svg'
import TxIcon from '../../Elements/icons/transactions.svg'
import LogsIcon from '../../Elements/icons/console.svg'
import SettingsIcon from '../../Elements/icons/settings.svg'
import SearchIcon from '../../Elements/icons/search.svg'
import ForceMineIcon from '../../Elements/icons/force_mine.svg'
import SnapshotIcon from '../../Elements/icons/snapshot.svg'
import StartMiningIcon from '../../Elements/icons/start.svg'
import StopMiningIcon from '../../Elements/icons/stop.svg'
import RevertIcon from '../../Elements/icons/revert.svg'

class TopNavbar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchInput: ""
    }
  }

  _handleStopMining = e => {
    this.props.appStopMining()
  }

  _handleStartMining = e => {
    this.props.appStartMining()
  }

  _handleForceMine = e => {
    this.props.appForceMine()
  }

  _handleMakeSnapshot = e => {
    this.props.appMakeSnapshot()
  }

  _handleRevertSnapshot = e => {
    this.props.appRevertSnapshot(this.props.core.snapshots.length)
  }

  handleSearchChange = e => {
    this.setState({
      searchInput: e.target.value
    })
  }

  handleSearchKeyPress = e => {
    if (e.key === 'Enter') {
      let value = this.state.searchInput.trim()

      // Secret to show the error screen when we need it.
      if (value.toLowerCase() == "error") {
        this.props.dispatch(setSystemError(new Error("You found a secret!")))
      } else {
        this.props.dispatch(Search.query(value))
      }

      this.setState({
        searchInput: ""
      })
    }
  }

  _renderSnapshotControls = () => {
    const { snapshots } = this.props.core
    const currentSnapshotId = snapshots.length
    const hasSnapshots = currentSnapshotId > 0
    const firstSnapshot = currentSnapshotId === 1

    return hasSnapshots
      ? <button
          className="MiningBtn"
          onClick={this._handleRevertSnapshot}
          disabled={snapshots.length === 0}
        >
          <RevertIcon /*size={18}*/ />
          {firstSnapshot
            ? `REVERT TO BASE`
            : `REVERT TO SNAPSHOT #${currentSnapshotId - 1}`}
        </button>
      : null
  }

  _renderMiningTime = () => {
    if (this.props.settings.server.blocktime) {
      return `${this.props.settings.server.blocktime} SEC block time`
    } else {
      return 'Automining'
    }
  }

  _renderMiningButtonText = () => {
    if (this.props.settings.server.blocktime) {
      return `MINING`
    } else {
      return 'AUTOMINING'
    }
  }

  _renderMiningControls = () => {
    return this.props.core.isMining
      ? <button
          className="MiningBtn"
          disabled={!this.props.core.isMining}
          onClick={this._handleStopMining}
        >
          <StopMiningIcon /*size={18} className="StopMining" */ />{' '}
          Stop {this._renderMiningButtonText()}
        </button>
      : <button
          className="MiningBtn"
          disabled={this.props.core.isMining}
          onClick={this._handleStartMining}
        >
          <StartMiningIcon /*size={18}*/ /> Start{' '}
          {this._renderMiningButtonText()}
        </button>
  }

  render () {
    const blockNumber = this.props.core.latestBlock
    const gasPrice = this.props.core.gasPrice
    const gasLimit = this.props.core.gasLimit
    const snapshots = this.props.core.snapshots
    const isMining = this.props.core.isMining

    const miningPaused = !isMining
    const currentSnapshotId = snapshots.length
    const showControls = false

    return (
      <nav className="TopNavBar">
        <main className="Main">
          <div className="Menu">
            <Link to="accounts" activeClassName="Active">
              <AccountIcon />
              Accounts
            </Link>
            <Link to="blocks" activeClassName="Active">
              <BlockIcon />
              Blocks
            </Link>
            <Link to="transactions" activeClassName="Active">
              <TxIcon />
              Transactions
            </Link>
            <Link to="logs" activeClassName="Active">
              <LogsIcon />
              Logs
            </Link>
          </div>
          <div className="SearchBar">
            <input
              type="text"
              placeholder="SEARCH FOR BLOCK NUMBERS OR TX HASHES"
              value={this.state.searchInput}
              onChange={this.handleSearchChange}
              onKeyPress={this.handleSearchKeyPress}
            />
            <SearchIcon />
          </div>
        </main>
        <section className="StatusAndControls">
          <div className="Status">
            <StatusIndicator title="CURRENT BLOCK" value={blockNumber} />
            <StatusIndicator title="GAS PRICE" value={gasPrice} />
            <StatusIndicator
              title="GAS LIMIT"
              value={gasLimit}
            />
            <StatusIndicator
              title="NETWORK ID"
              value={this.props.settings.server.network_id}
            />
            <StatusIndicator
              title="RPC SERVER"
              value={`http://${window.location.hostname}/web3`}
            />
            <StatusIndicator
              title="MINING STATUS"
              value={miningPaused ? 'STOPPED' : this._renderMiningTime()}
            >
              <OnlyIf test={isMining}>
                <Spinner />
              </OnlyIf>
            </StatusIndicator>
          </div>
          <div className="Actions">
            <OnlyIf
              test={
                showControls
              }
            >
              <button
                className="MiningBtn"
                onClick={this._handleForceMine}
              >
                <ForceMineIcon /*size={18}*/ /> Force Mine
              </button>
            </OnlyIf>
            <OnlyIf test={showControls}>
              <button
                className="MiningBtn"
                onClick={this._handleMakeSnapshot}
              >
                <SnapshotIcon /*size={18}*/ /> TAKE SNAPSHOT #{currentSnapshotId + 1}
              </button>
            </OnlyIf>
            <OnlyIf test={showControls}>
              {this._renderSnapshotControls()}
            </OnlyIf>
          </div>
        </section>
      </nav>
    )
  }
}

export default connect(TopNavbar)
