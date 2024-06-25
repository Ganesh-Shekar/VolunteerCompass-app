import React from 'react';
import { Text, StyleSheet } from 'react-native';

const TermsAndConditionsText = () => {
  return (
    <Text style={styles.text}>
      <Text style={styles.header}>Terms and Conditions{'\n'}</Text>
      <Text style={styles.subHeader}>Effective Date: January 1, 2024{'\n'}</Text>

      <Text style={styles.sectionHeader}>1. Introduction{'\n'}</Text>
      <Text style={styles.bodyText}>
        These terms and conditions govern your use of our mobile application and website. By accessing our application, you agree to comply with these terms and conditions.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>2. Use License{'\n'}</Text>
      <Text style={styles.bodyText}>
        Permission is granted to temporarily download one copy of the materials (information or software) on our application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose, or for any public display (commercial or non-commercial); attempt to decompile or reverse engineer any software contained on our application; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or 'mirror' the materials on any other server. This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>3. Disclaimer{'\n'}</Text>
      <Text style={styles.bodyText}>
        The materials on our application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on our application or otherwise relating to such materials or on any sites linked to our application.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>4. Limitations{'\n'}</Text>
      <Text style={styles.bodyText}>
        In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our application, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>5. Revisions and Errata{'\n'}</Text>
      <Text style={styles.bodyText}>
        The materials appearing on our application could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our application are accurate, complete, or current. We may make changes to the materials contained on our application at any time without notice. We do not, however, make any commitment to update the materials.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>6. Links{'\n'}</Text>
      <Text style={styles.bodyText}>
        We have not reviewed all of the sites linked to our application and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked application is at the user's own risk.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>7. Site Terms of Use Modifications{'\n'}</Text>
      <Text style={styles.bodyText}>
        We may revise these terms of use for our application at any time without notice. By using our application you are agreeing to be bound by the then current version of these Terms and Conditions of Use.{'\n\n'}
      </Text>

      <Text style={styles.sectionHeader}>8. Governing Law{'\n'}</Text>
      <Text style={styles.bodyText}>
        Any claim relating to our application shall be governed by the laws of the State of California without regard to its conflict of law provisions.{'\n\n'}
      </Text>

      <Text style={styles.bodyText}>
        If you have any questions or concerns about these terms and conditions, please contact us at terms@ourapp.com.{'\n\n'}
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

export default TermsAndConditionsText;
