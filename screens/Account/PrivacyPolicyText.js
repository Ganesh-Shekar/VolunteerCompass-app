import React from "react";
import { Text, StyleSheet } from "react-native";

const PrivacyPolicyText = () => {
  return (
    <Text style={styles.text}>
      <Text style={styles.header}>Privacy Policy{"\n"}</Text>
      <Text style={styles.subHeader}>
        Effective Date: January 1, 2024{"\n"}
      </Text>

      <Text style={styles.sectionHeader}>1. Introduction{"\n"}</Text>
      <Text style={styles.bodyText}>
        Our privacy policy explains how we collect, use, and protect information
        about you. By using our application, you agree to the terms of this
        policy.{"\n\n"}
      </Text>

      <Text style={styles.sectionHeader}>2. Information We Collect{"\n"}</Text>
      <Text style={styles.bodyText}>
        We collect personal information such as your name, email address, and
        phone number when you register with us. We also collect information
        about your usage of our application, including log data and device
        information.{"\n\n"}
      </Text>

      <Text style={styles.sectionHeader}>
        3. How We Use Your Information{"\n"}
      </Text>
      <Text style={styles.bodyText}>
        We use the information we collect to provide, maintain, and improve our
        application and services. This includes personalizing content,
        understanding user behavior, and communicating with you about updates
        and promotions.{"\n\n"}
      </Text>

      <Text style={styles.sectionHeader}>
        4. Sharing Your Information{"\n"}
      </Text>
      <Text style={styles.bodyText}>
        We may share your information with third-party service providers who
        help us operate our application and services. We do not sell your
        personal information to third parties.{"\n\n"}
      </Text>

      <Text style={styles.sectionHeader}>
        5. Security of Your Information{"\n"}
      </Text>
      <Text style={styles.bodyText}>
        We take reasonable measures to protect your information from
        unauthorized access, use, or disclosure. However, no method of
        transmission over the internet or electronic storage is completely
        secure.{"\n\n"}
      </Text>

      <Text style={styles.sectionHeader}>
        6. Changes to This Privacy Policy{"\n"}
      </Text>
      <Text style={styles.bodyText}>
        We may update our privacy policy from time to time. We will notify you
        of any changes by posting the new policy on this page. You are advised
        to review this privacy policy periodically for any changes.{"\n\n"}
      </Text>

      <Text style={styles.sectionHeader}>7. Contact Us{"\n"}</Text>
      <Text style={styles.bodyText}>
        If you have any questions or concerns about our privacy policy, please
        contact us at privacy@ourapp.com.{"\n\n"}
      </Text>

      <Text style={styles.bodyText}>Thank you for using our application!</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    padding: 10,
    color: "#000",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'left',
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "left",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default PrivacyPolicyText;
