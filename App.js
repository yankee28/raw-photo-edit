
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TOOLS = [
  { key: 'brightness', name: 'Parlaklık', icon: '☀' },
  { key: 'contrast', name: 'Kontrast', icon: '◐' },
  { key: 'saturation', name: 'Doygunluk', icon: '◉' },
  { key: 'sharpness', name: 'Keskinlik', icon: '✳' },
];

export default function App() {
  const [photo, setPhoto] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [values, setValues] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
  });

  async function choosePhoto() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Galeri izni gerekli',
          'Fotoğraf seçmek için galeri erişimine izin vermelisin.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length) {
        setPhoto(result.assets[0].uri);
        setRotation(0);
        setValues({
          brightness: 0,
          contrast: 0,
          saturation: 0,
          sharpness: 0,
        });
      }
    } catch (error) {
      Alert.alert('Hata', 'Fotoğraf seçilirken sorun oluştu.');
    }
  }

  function changeValue(key, amount) {
    setValues(old => ({
      ...old,
      [key]: Math.max(-100, Math.min(100, old[key] + amount)),
    }));
  }

  function resetAll() {
    setRotation(0);
    setValues({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101114" />

      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            RAW <Text style={styles.accent}>PHOTO EDIT</Text>
          </Text>
          <Text style={styles.tagline}>
            PROFESSIONAL PHOTO STUDIO
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>STUDIO</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Fotoğrafını düzenle.</Text>
        <Text style={styles.subtitle}>
          Işığı yönet. Kendi tarzını yarat.
        </Text>

        <View style={styles.preview}>
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={[
                styles.photo,
                { transform: [{ rotate: `${rotation}deg` }] },
              ]}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.empty}>
              <View style={styles.cameraCircle}>
                <Text style={styles.camera}>◎</Text>
              </View>
              <Text style={styles.emptyTitle}>
                Kareyi içeri al
              </Text>
              <Text style={styles.emptyText}>
                Galerinden bir fotoğraf seçerek başla.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={choosePhoto}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryText}>
                  +  Fotoğraf seç
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {photo && (
          <>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.action}
                onPress={() => setRotation(r => r + 90)}
              >
                <Text style={styles.actionIcon}>↻</Text>
                <Text style={styles.actionText}>Döndür</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.action}
                onPress={resetAll}
              >
                <Text style={styles.actionIcon}>⟲</Text>
                <Text style={styles.actionText}>Sıfırla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.action}
                onPress={() => {
                  setPhoto(null);
                  resetAll();
                }}
              >
                <Text style={styles.actionIcon}>×</Text>
                <Text style={styles.actionText}>Kaldır</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.changePhoto}
              onPress={choosePhoto}
            >
              <Text style={styles.changePhotoText}>
                Başka fotoğraf seç
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>
                Temel düzenlemeler
              </Text>
              <Text style={styles.panelSubtitle}>
                Görüntü kontrol merkezi
              </Text>
            </View>
            <TouchableOpacity onPress={resetAll}>
              <Text style={styles.reset}>SIFIRLA</Text>
            </TouchableOpacity>
          </View>

          {TOOLS.map(tool => (
            <View key={tool.key} style={styles.tool}>
              <View style={styles.toolHeader}>
                <Text style={styles.toolName}>
                  {tool.icon}  {tool.name}
                </Text>
                <Text style={styles.toolValue}>
                  {values[tool.key] > 0 ? '+' : ''}
                  {values[tool.key]}
                </Text>
              </View>

              <View style={styles.controlRow}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  disabled={!photo}
                  onPress={() => changeValue(tool.key, -10)}
                >
                  <Text style={styles.adjustText}>−</Text>
                </TouchableOpacity>

                <View style={styles.track}>
                  <View style={styles.trackCenter} />
                  <View
                    style={[
                      styles.knob,
                      {
                        left: `${(values[tool.key] + 100) / 2}%`,
                      },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={styles.adjustButton}
                  disabled={!photo}
                  onPress={() => changeValue(tool.key, 10)}
                >
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={styles.note}>
            İlk sürüm: düzenleme paneli. Gerçek renk işleme
            ve fotoğraf kaydetme motoru sonraki aşamada eklenecek.
          </Text>
        </View>

        <View style={styles.exportPanel}>
          <Text style={styles.exportTitle}>Dışa aktarma</Text>
          <Text style={styles.exportSubtitle}>
            Fotoğraflarını yüksek kalitede kaydetme özelliği
            sonraki sürümde eklenecek.
          </Text>
          <View style={styles.exportButton}>
            <Text style={styles.exportButtonText}>
              ↓  YÜKSEK KALİTEDE KAYDET
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          RAW PHOTO EDIT  •  HER KAREDE SENİN İMZAN
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101114',
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#292A30',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  accent: {
    color: '#B8F34A',
  },
  tagline: {
    color: '#888A91',
    fontSize: 9,
    letterSpacing: 1.7,
    marginTop: 6,
  },
  badge: {
    backgroundColor: '#252920',
    borderColor: '#454C38',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  badgeText: {
    color: '#B8F34A',
    fontSize: 9,
    fontWeight: '900',
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },
  subtitle: {
    color: '#92939B',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 19,
  },
  preview: {
    height: 310,
    borderRadius: 20,
    backgroundColor: '#191A1F',
    borderWidth: 1,
    borderColor: '#303137',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#292D23',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 17,
  },
  camera: {
    fontSize: 38,
    color: '#B8F34A',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  emptyText: {
    color: '#92939B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 19,
  },
  primaryButton: {
    backgroundColor: '#B8F34A',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  primaryText: {
    color: '#171A12',
    fontSize: 14,
    fontWeight: '900',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  action: {
    minWidth: 75,
    alignItems: 'center',
    padding: 8,
  },
  actionIcon: {
    color: '#B8F34A',
    fontSize: 25,
  },
  actionText: {
    color: '#D0D0D5',
    fontSize: 11,
    marginTop: 4,
  },
  changePhoto: {
    alignSelf: 'center',
    padding: 9,
  },
  changePhotoText: {
    color: '#B8F34A',
    fontSize: 12,
    fontWeight: '700',
  },
  panel: {
    marginTop: 20,
    padding: 17,
    backgroundColor: '#191A1F',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#2D2E34',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 23,
  },
  panelTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  panelSubtitle: {
    color: '#85868D',
    fontSize: 11,
    marginTop: 5,
  },
  reset: {
    color: '#B8F34A',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tool: {
    marginBottom: 23,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  toolName: {
    color: '#E7E7EA',
    fontSize: 13,
    fontWeight: '600',
  },
  toolValue: {
    color: '#B8F34A',
    fontWeight: '900',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  adjustButton: {
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: '#2A2C31',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustText: {
    color: '#FFFFFF',
    fontSize: 19,
  },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#383A40',
    justifyContent: 'center',
  },
  trackCenter: {
    position: 'absolute',
    left: '50%',
    height: 12,
    width: 2,
    backgroundColor: '#777980',
  },
  knob: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: -6,
    backgroundColor: '#B8F34A',
    borderWidth: 2,
    borderColor: '#191A1F',
  },
  note: {
    color: '#85868D',
    fontSize: 11,
    lineHeight: 17,
  },
  exportPanel: {
    backgroundColor: '#20231D',
    borderColor: '#414B34',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  exportTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  exportSubtitle: {
    color: '#A5A79F',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  exportButton: {
    marginTop: 14,
    padding: 13,
    backgroundColor: '#B8F34A',
    borderRadius: 10,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#171A12',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  footer: {
    color: '#62636B',
    fontSize: 9,
    letterSpacing: 1.1,
    textAlign: 'center',
    marginTop: 25,
  },
});

