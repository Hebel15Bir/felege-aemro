'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: 'NotoSansEthiopic',
  src: 'NotoSansEthiopic-VariableFont_wdth,wght.ttf',
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansEthiopic',
    padding: 20,
    backgroundColor: '#fff',
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
  },
  idBox: {
    width: '30%',
    height: '30%',
    border: '1px solid #000',
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
    fontSize: 18,
  },
});

export function RegistrationIDDocument({ registrationIds }) {
  return (
    <Document>
      <Page size='A4' orientation='landscape' style={styles.page}>
        <View style={styles.gridContainer}>
          {registrationIds.map((student, index) => (
            <View key={index} style={styles.idBox}>
              {/* the id details here */}
              <Text render={() => student.fullName} />
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
