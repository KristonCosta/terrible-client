import React from 'react';
import { ActivityIndicator, Button, ScrollView, Text, View, StyleSheet, ListView, TextInput } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      text: ''
    }
    this.baseState = this.state
  }

  onPressSend(event) {
    return fetch('http://192.168.0.111:8123/messages', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Content: this.state.text,
      }),
    })
    .catch((error) => {
      console.error(error);
    })
    .then(this.resetState.bind(this));
  }

  resetState() {
    return fetch('http://192.168.0.111:8123/messages')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson),
        }, function() {
         
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    return this.resetState()
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <ListView ref="listView"
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData.Content}</Text>}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Type a message"
          onChangeText={(text) => this.setState({text: text})}
        />
    
        <Button
          onPress={this.onPressSend.bind(this)}
          title="Send"
          color="#841584"
          accessibilityLabel="Send eMssage"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
