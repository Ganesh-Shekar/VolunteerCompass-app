import React from 'react';
import { Text, StyleSheet } from 'react-native';

const LicensesText = () => {
  return (
    <Text style={styles.text}>
      <Text style={styles.header}>Licenses{'\n'}</Text>
      <Text style={styles.subHeader}>Effective Date: January 1, 2024{'\n'}</Text>

      <Text style={styles.sectionHeader}>1. Introduction{'\n'}</Text>
      <Text style={styles.bodyText}>
        This document provides information about the licenses of various components and libraries used in our application.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>2. Open Source Libraries{'\n'}</Text>
      <Text style={styles.bodyText}>
        Our application uses the following open source libraries:{'\n\n'}
        - <Text style={styles.bold}>React Native{'\n'}</Text>
        {'  '}License: MIT{'\n'}
        {'  '}Link: https://github.com/facebook/react-native/blob/main/LICENSE{'\n\n'}
        - <Text style={styles.bold}>Expo{'\n'}</Text>
        {'  '}License: MIT{'\n'}
        {'  '}Link: https://github.com/expo/expo/blob/main/LICENSE{'\n\n'}
        - <Text style={styles.bold}>AsyncStorage{'\n'}</Text>
        {'  '}License: MIT{'\n'}
        {'  '}Link: https://github.com/react-native-async-storage/async-storage/blob/main/LICENSE{'\n\n'}
        - <Text style={styles.bold}>React Navigation{'\n'}</Text>
        {'  '}License: MIT{'\n'}
        {'  '}Link: https://github.com/react-navigation/react-navigation/blob/main/LICENSE{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>3. Icons{'\n'}</Text>
      <Text style={styles.bodyText}>
        We use icons from the following sources:{'\n\n'}
        - <Text style={styles.bold}>React Native Heroicons{'\n'}</Text>
        {'  '}License: MIT{'\n'}
        {'  '}Link: https://github.com/tailwindlabs/heroicons/blob/master/LICENSE{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>4. Additional Libraries{'\n'}</Text>
      <Text style={styles.bodyText}>
        Other libraries and frameworks we use may include:{'\n\n'}
        - <Text style={styles.bold}>Axios{'\n'}</Text>
        {'  '}License: MIT{'\n'}
        {'  '}Link: https://github.com/axios/axios/blob/master/LICENSE{'\n\n'}
        - <Text style={styles.bold}>Lodash{'\n'}</Text>
        {'  '}License: MIT{'\n'}
        {'  '}Link: https://github.com/lodash/lodash/blob/master/LICENSE{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>5. Acknowledgments{'\n'}</Text>
      <Text style={styles.bodyText}>
        We acknowledge and are grateful to the developers and maintainers of these open source projects. Their contributions make it possible for us to build and improve our application.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>6. Contact Us{'\n'}</Text>
      <Text style={styles.bodyText}>
        If you have any questions or concerns about these licenses, please contact us at licenses@ourapp.com.{'\n\n'}
      </Text>

      <Text style={styles.bodyText}>
        Thank you for using our application!
      </Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    padding: 10,
    color: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'left',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default LicensesText;
