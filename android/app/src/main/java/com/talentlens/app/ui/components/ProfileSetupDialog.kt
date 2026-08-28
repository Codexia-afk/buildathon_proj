package com.talentlens.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.talentlens.app.model.AthleteProfile
import com.talentlens.app.model.Gender
import com.talentlens.app.model.SportType
import com.talentlens.app.ui.theme.*

val INDIAN_STATES_LIST = listOf(
    "Haryana", "Kerala", "Punjab", "Maharashtra", "Odisha", "Manipur",
    "Tamil Nadu", "Karnataka", "Assam", "Telangana", "Uttar Pradesh",
    "Rajasthan", "Gujarat", "Madhya Pradesh", "West Bengal", "Jharkhand"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileSetupDialog(
    initialProfile: AthleteProfile,
    onDismiss: () -> Unit,
    onSave: (AthleteProfile) -> Unit
) {
    var name by remember { mutableStateOf(initialProfile.fullName) }
    var age by remember { mutableStateOf(initialProfile.age.toString()) }
    var gender by remember { mutableStateOf(initialProfile.gender) }
    var sport by remember { mutableStateOf(initialProfile.primarySport) }
    var state by remember { mutableStateOf(initialProfile.state) }
    var district by remember { mutableStateOf(initialProfile.district) }
    var academy by remember { mutableStateOf(initialProfile.schoolOrAcademy) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = BackgroundDark),
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
                .border(1.dp, CardBorder, RoundedCornerShape(24.dp))
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = BrandOrange)
                        Text("Athlete Profile", color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondary)
                    }
                }

                Divider(color = CardBorder)

                // Full Name
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Name", color = TextSecondary) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = CardBackground,
                        unfocusedContainerColor = CardBackground,
                        focusedBorderColor = BrandOrange,
                        unfocusedBorderColor = CardBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                // Age & District
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = age,
                        onValueChange = { age = it },
                        label = { Text("Age (Yrs)", color = TextSecondary) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = CardBackground,
                            unfocusedContainerColor = CardBackground,
                            focusedBorderColor = BrandOrange,
                            unfocusedBorderColor = CardBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        ),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.weight(1f)
                    )

                    OutlinedTextField(
                        value = district,
                        onValueChange = { district = it },
                        label = { Text("District", color = TextSecondary) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = CardBackground,
                            unfocusedContainerColor = CardBackground,
                            focusedBorderColor = BrandOrange,
                            unfocusedBorderColor = CardBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        ),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.weight(1.5f)
                    )
                }

                // Gender Chips
                Text("Gender", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf(Gender.MALE, Gender.FEMALE).forEach { g ->
                        val isSelected = g == gender
                        Surface(
                            color = if (isSelected) BrandOrange else CardBackground,
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) BrandOrange else CardBorder),
                            modifier = Modifier.weight(1f).clickable { gender = g }
                        ) {
                            Text(
                                g.displayName,
                                color = if (isSelected) TextPrimary else TextSecondary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(vertical = 10.dp),
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                        }
                    }
                }

                // State Picker Carousel
                Text("State / Territory", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(INDIAN_STATES_LIST) { st ->
                        val isSelected = st == state
                        Surface(
                            color = if (isSelected) BrandOrange.copy(alpha = 0.2f) else CardBackground,
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) BrandOrange else CardBorder),
                            modifier = Modifier.clickable { state = st }
                        ) {
                            Text(
                                text = st,
                                color = if (isSelected) BrandOrange else TextSecondary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }

                // Sport Discipline Carousel
                Text("Primary Sport Discipline", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(SportType.values()) { sp ->
                        val isSelected = sp == sport
                        Surface(
                            color = if (isSelected) CyberCyan.copy(alpha = 0.2f) else CardBackground,
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) CyberCyan else CardBorder),
                            modifier = Modifier.clickable { sport = sp }
                        ) {
                            Text(
                                text = sp.displayName,
                                color = if (isSelected) CyberCyan else TextSecondary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }

                // Academy Name
                OutlinedTextField(
                    value = academy,
                    onValueChange = { academy = it },
                    label = { Text("School / Academy / Akhada", color = TextSecondary) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = CardBackground,
                        unfocusedContainerColor = CardBackground,
                        focusedBorderColor = BrandOrange,
                        unfocusedBorderColor = CardBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                // Save Button
                Button(
                    onClick = {
                        val updated = initialProfile.copy(
                            fullName = name.ifBlank { "Athlete" },
                            age = age.toIntOrNull() ?: 17,
                            gender = gender,
                            primarySport = sport,
                            state = state,
                            district = district.ifBlank { "District" },
                            schoolOrAcademy = academy
                        )
                        onSave(updated)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BrandOrange),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth().height(50.dp)
                ) {
                    Text("Save & Set Active Profile", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
