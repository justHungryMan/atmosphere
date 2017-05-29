import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { getDatabase } from'../database/database';
import { userData } from'../userID';

import FeedBoxHeader from './FeedBoxHeader';
import FeedBoxContent from './FeedBoxContent';
import FeedBoxFunctionBar from './FeedBoxFunctionBar';
import FeedBoxComment from './FeedBoxComment';

const styles = StyleSheet.create({
  FeedBox: {
    flex: 1,
  },
});

export default class FeedBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMusicIconSelected: false,
      isHeartIconSelected: false,
    };
    this.musicIconSelect = this.musicIconSelect.bind(this);
    this.heartIconSelect = this.heartIconSelect.bind(this);
  }
  musicIconSelect() {
    this.setState({
      isMusicIconSelected: !this.state.isMusicIconSelected,
    });
  }
  heartIconSelect() {
    const isHeartIconSelected = this.state.isHeartIconSelected;
    return new Promise((resolve) => {
      const nextStatus = !isHeartIconSelected;
      this.setState({
        isHeartIconSelected: nextStatus,
      });
      return resolve(nextStatus);
    })
    .then((status) => {
      const query = {};
      if (status) {
        query[userData.userID] = userData.userID;
      } else {
        query[userData.userID] = null;
      }
      return query;
    })
    .then(query => getDatabase().ref('posts').child(this.props.data.postID.V.path.o[1]).child('likes').set(query));
  }
  componentDidMount() {
    getDatabase().ref('posts').child(this.props.data.postID.V.path.o[1]).child('likes')
    .once('value', (snap) => {
      snap.forEach((likeData) => {
        if (likeData.val() === userData.userID) {
          this.setState({
            isHeartIconSelected: true,
          })
        }
      })
    });
  }
  render() {
    return (
      <View style={styles.FeedBox}>
        <FeedBoxHeader userName={this.props.data.authorName} />
        <FeedBoxContent content={this.props.data.content} />
        <FeedBoxFunctionBar isHeartIconSelected={this.state.isHeartIconSelected} heartIconSelect = {this.heartIconSelect} musicIconSelect={this.musicIconSelect} isMusicIconSelected={this.state.isMusicIconSelected} likes={this.props.data.likes} shares={this.props.data.shares}/>
        <FeedBoxComment isMusicIconSelected={this.state.isMusicIconSelected} comments={this.props.data.comments }/>
      </View>
    );
  }
}
