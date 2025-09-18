import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BaseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BaseBottomSheet({
  isOpen,
  onClose,
  title,
  children
}: BaseBottomSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  // Open/close modal
  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  // Dismiss callback
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose]
  );

  // Backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['50%', '90%', '100%']}
      index={0}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundComponent={({ style }) => (
        <View style={style} className="bg-background rounded-t-2xl flex-1" />
      )}
    >
      <BottomSheetView className="bg-background rounded-t-2xl">
        <View className="px-5 pt-4 pb-2">
          <View className="items-center">
            <Text className="text-xl font-bold text-foreground">{title}</Text>
          </View>
        </View>
        <View className="px-5 flex-1">
          {children}
        </View>
        {/* Bottom safe area padding */}
        <View style={{ paddingBottom: Math.max(insets.bottom, 16) }} />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default BaseBottomSheet;
