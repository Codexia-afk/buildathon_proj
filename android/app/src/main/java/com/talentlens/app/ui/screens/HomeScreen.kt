package com.talentlens.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talentlens.app.ui.theme.*

@Composable
fun HomeScreen(
    onStartAthleteAssessment: () -> Unit,
    onOpenScoutDashboard: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(20.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Spacer(Modifier.height(10.dp))

        // Brand Title
        Text(
            text = "TALENTLENS",
            color = BrandOrange,
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = 4.sp
        )

        Text(
            text = "Discover Talent,\nWherever It's Hiding.",
            color = TextPrimary,
            fontSize = 28.sp,
            fontWeight = FontWeight.ExtraBold,
            textAlign = TextAlign.Center,
            lineHeight = 34.sp
        )

        Text(
            text = "Turn your phone camera into an AI-powered physical fitness testing lab. Client-side MediaPipe pose estimation verifies biomechanics and benchmarks scores against national Indian percentiles.",
            color = TextSecondary,
            fontSize = 13.sp,
            textAlign = TextAlign.Center,
            lineHeight = 20.sp,
            modifier = Modifier.padding(horizontal = 8.dp)
        )

        Spacer(Modifier.height(8.dp))

        // Dual Entry Cards
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.5.dp, BrandOrange.copy(alpha = 0.6f), RoundedCornerShape(24.dp))
                .clickable { onStartAthleteAssessment() }
        ) {
            Row(
                modifier = Modifier.padding(20.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Surface(
                    color = BrandOrange,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.size(54.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.FitnessCenter, contentDescription = null, tint = TextPrimary, modifier = Modifier.size(28.dp))
                    }
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text("I'M AN ATHLETE", color = BrandOrange, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text("Test Physical Fitness", color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
                    Text("Push-ups, Squats, Plank & Vertical Jump", color = TextSecondary, fontSize = 11.sp)
                }
                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = BrandOrange)
            }
        }

        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, CardBorder, RoundedCornerShape(24.dp))
                .clickable { onOpenScoutDashboard() }
        ) {
            Row(
                modifier = Modifier.padding(20.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Surface(
                    color = CyberCyan.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.size(54.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(Icons.Default.Group, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(28.dp))
                    }
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text("I'M A SCOUT / COACH", color = CyberCyan, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text("Scout Discovery Feed", color = TextPrimary, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
                    Text("Live verified athlete stream across India", color = TextSecondary, fontSize = 11.sp)
                }
                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = TextSecondary)
            }
        }

        Spacer(Modifier.height(12.dp))

        // Feature Highlights
        Surface(
            color = CardBackground,
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Bolt, contentDescription = null, tint = BrandOrange, modifier = Modifier.size(16.dp))
                    Text("100% On-Device Edge Compute (Zero Latency)", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Verified, contentDescription = null, tint = VerifiedEmerald, modifier = Modifier.size(16.dp))
                    Text("SAI & Khelo India Aligned Age Cohort Percentiles", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Mic, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(16.dp))
                    Text("Real-Time AI Voice Coach Audio Feedback", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
