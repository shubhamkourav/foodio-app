import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { prepareSvgForNative } from '@/utils/prepareSvgForNative';

export interface OnboardingIllustrationProps {
  source: number;
  format?: 'svg' | 'png';
  width?: number;
  height?: number;
}

export function OnboardingIllustration({
  source,
  format = 'svg',
  width = 300,
  height = 300,
}: OnboardingIllustrationProps) {
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    if (format !== 'svg') return;

    let cancelled = false;

    (async () => {
      try {
        const asset = Asset.fromModule(source);
        await asset.downloadAsync();
        const uri = asset.localUri ?? asset.uri;
        const response = await fetch(uri);
        const text = await response.text();
        if (!cancelled) {
          setXml(prepareSvgForNative(text));
        }
      } catch {
        if (!cancelled) setXml(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [format, source]);

  if (format === 'png') {
    return (
      <Image
        source={source}
        style={{ width, height }}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
    );
  }

  if (!xml) {
    return <View style={[styles.placeholder, { width, height }]} />;
  }

  return <SvgXml xml={xml} width={width} height={height} />;
}

const styles = StyleSheet.create({
  placeholder: {
    opacity: 0,
  },
});
