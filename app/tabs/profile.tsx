import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

export default function Profile() {
  // Main profile data (simulate fetched data)
  const [profile, setProfile] = useState({
    fullName: 'Yemi-Oyebola Tomilade',
    email: 'oyebolatomilade@gmail.com',
    phone: '+234 801 234 5678',
    address: '123 Lagos Street, Victoria Island, Lagos',
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  // Local state for edits
  const [editProfile, setEditProfile] = useState(profile);

  // Handlers
  const handleEdit = () => {
    setEditProfile(profile);
    setIsEditing(true);
  };
  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };
  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Picture and Basic Info */}
      <View style={styles.profileTop}>
        <View style={styles.avatarPlaceholder}>
          <Feather name="user" size={44} color="#bbb" />
        </View>
        <Text style={styles.userName}>{profile.fullName}</Text>
        <Text style={styles.userEmail}>{profile.email}</Text>
      </View>

      {/* Profile Information Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Feather name="user" size={18} color="#555" style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Profile Information</Text>
          </View>
          {!isEditing ? (
            <TouchableOpacity onPress={handleEdit}>
              <MaterialIcons name="edit-square" size={20} color="#555" />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.cardSubtitle}>Manage your personal information</Text>
        <View style={styles.fieldsSection}>
          {/* Full Name */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldValueBoxInput}
                value={editProfile.fullName}
                onChangeText={v => setEditProfile({ ...editProfile, fullName: v })}
                placeholder="Full Name"
                placeholderTextColor="#bbb"
              />
            ) : (
              <View style={styles.fieldValueBox}><Text style={styles.fieldValue}>{profile.fullName}</Text></View>
            )}
          </View>
          {/* Email Address */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldValueBoxInput}
                value={editProfile.email}
                onChangeText={v => setEditProfile({ ...editProfile, email: v })}
                placeholder="Email Address"
                placeholderTextColor="#bbb"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <View style={styles.fieldValueBox}><Text style={styles.fieldValue}>{profile.email}</Text></View>
            )}
          </View>
          {/* Phone Number */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldValueBoxInput}
                value={editProfile.phone}
                onChangeText={v => setEditProfile({ ...editProfile, phone: v })}
                placeholder="Phone Number"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
              />
            ) : (
              <View style={styles.fieldValueBox}><Text style={styles.fieldValue}>{profile.phone}</Text></View>
            )}
          </View>
          {/* Address */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Address</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldValueBoxInput}
                value={editProfile.address}
                onChangeText={v => setEditProfile({ ...editProfile, address: v })}
                placeholder="Address"
                placeholderTextColor="#bbb"
              />
            ) : (
              <View style={styles.fieldValueBox}><Text style={styles.fieldValue}>{profile.address}</Text></View>
            )}
          </View>
          {/* Change Password */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Change Password</Text>
            <TouchableOpacity style={styles.changePasswordBox}>
              <Text style={styles.changePasswordText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Save/Cancel Buttons */}
        {isEditing && (
          <View style={styles.editActionsRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  profileTop: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
    fontFamily: 'System',
  },
  userEmail: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'System',
    marginBottom: 2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'System',
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
    marginTop: 2,
    fontFamily: 'System',
    textAlign: 'left',
  },
  fieldsSection: {
    marginTop: 2,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'System',
    textAlign: 'left',
  },
  fieldValueBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 38,
    justifyContent: 'center',
  },
  fieldValue: {
    fontSize: 15,
    color: colors.text,
    fontFamily: 'System',
    textAlign: 'left',
  },
  fieldValueBoxInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 38,
    fontSize: 15,
    color: colors.text,
    fontFamily: 'System',
  },
  changePasswordBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  changePasswordText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'System',
  },
  editActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  saveBtnText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  cancelBtnText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 