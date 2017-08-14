import React, { Component } from 'react';
import { ActivityIndicator, ListView, Text, View, Picker, TextInput, KeyboardAvoidingView, StyleSheet } from 'react-native';

var styles = StyleSheet.create({
  pickerContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row'
  },
  picker: {
    width: '50%'
  },
  titleLabel: {
    textAlign: 'center'
  }
});

export default class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    return fetch('http://api.fixer.io/latest')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let rates = responseJson.rates;
        var ratesArr = [];

        Object.keys(rates).forEach(function(key) {
          console.log(key, rates[key]);
          ratesArr.push({curr: key, val: rates[key]});
        });

        this.setState({
          isLoading: false,
          model: responseJson,
          ratesArr: ratesArr,
          dataSource: ds.cloneWithRows(ratesArr),
          amt: '',
          currFrom: ratesArr[0].curr,
          currTo: ratesArr[0].curr
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateFromCurr(curr) {
    this.setState({ currFrom: curr });
  }

  updateToCurr(curr) {
    this.setState({ currTo: curr });
  }

  onUpdateAmt(amt) {
    if (!isNaN(Number(amt))) {
      this.setState({ amt: amt });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    var currPickerItems = this.state.ratesArr.map(function(entry){
                            return <Picker.Item key = {entry.curr} label = {entry.curr} value = {entry.curr} />;
                          });

    var conversionResult = (this.state.model.rates[this.state.currTo] / this.state.model.rates[this.state.currFrom]) * Number(this.state.amt);

    return (
      //KeyboardAvoidingView
      <View style={{flex: 1, paddingTop: 20}}>
      <TextInput value={this.state.amt}
             placeholder = "Amount"
             placeholderTextColor = "#9a73ef"
             keyboardType = "numeric"
             autoCapitalize = "none"
             onChangeText = {this.onUpdateAmt.bind(this)}/>

        <View style = {styles.pickerContainer}>
          <Text style = {[styles.picker, styles.titleLabel]}>From</Text>
          <Text style = {[styles.picker, styles.titleLabel]}>To</Text>
        </View>

        <View style = {styles.pickerContainer}>
          <Picker selectedValue = {this.state.currFrom} onValueChange = {this.updateFromCurr.bind(this)} style={styles.picker}>
            {currPickerItems}
          </Picker>
          <Picker selectedValue = {this.state.currTo} onValueChange = {this.updateToCurr.bind(this)} style={styles.picker}>
            {currPickerItems}
          </Picker>
        </View>

        <Text>Result: {conversionResult.toFixed(2).toString()} {this.state.currTo}</Text>
      </View>

      // <ListView
      //   dataSource={this.state.dataSource}
      //   renderRow={(rowData) => <Text>{rowData.curr} : {rowData.val}</Text>}
      // />
    );
  }
}
