import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { styles } from './DashboardScreen.styles';
import { getDashboardStats, DashboardData } from '@/src/services/dashboard.service';
import { theme } from '@/src/theme';

const DashboardScreen = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [data, setData] = useState<DashboardData | null>(null);

    const fetchData = async () => {
        try {
            const stats = await getDashboardStats();
            setData(stats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>No se pudieron cargar los datos.</Text>
            </View>
        );
    }

    // Preparar datos para el gráfico de barras
    const barData = data.precisionMensual.map(item => ({
        value: parseFloat(item.promedio),
        label: item.mes,
        frontColor: theme.colors.primary,
        gradientColor: '#4ABFF4',
        spacing: 20,
    }));

    // Preparar datos para el gráfico de pastel
    const pieData = data.distribucionSuelo.map((item, index) => ({
        value: item.cantidad,
        text: `${item.cantidad}`, // Mostrar cantidad como texto
        color: getRandomColor(index),
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Métricas clave de rendimiento</Text>
            </View>

            {/* Sección de KPIs */}
            <View style={styles.kpiContainer}>
                <KpiCard title="Terrenos" value={data.kpis.terrenosRegistrados.toString()} />
                <KpiCard title="Usuarios" value={data.kpis.usuariosNuevos.toString()} />
                <KpiCard title="Zonas" value={data.kpis.zonasCubiertas.toString()} />
                <KpiCard title="Precisión IA" value={data.kpis.precisionIA} />
            </View>

            {/* Gráfico de Barras: Precisión Mensual */}
            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Precisión Promedio Mensual (%)</Text>
                {barData.length > 0 ? (
                    <BarChart
                        data={barData}
                        width={300}
                        height={220}
                        barWidth={22}
                        noOfSections={4}
                        barBorderRadius={4}
                        frontColor={theme.colors.primary}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        yAxisTextStyle={{ color: 'gray' }}
                        xAxisLabelTextStyle={{ color: 'gray' }}
                        isAnimated
                        showGradient
                    />
                ) : (
                    <Text style={{ color: 'gray' }}>No hay datos suficientes</Text>
                )}
            </View>

            {/* Gráfico de Pastel: Distribución de Suelo */}
            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Distribución por Tipo de Suelo</Text>
                {pieData.length > 0 ? (
                    <View style={{ alignItems: 'center' }}>
                        <PieChart
                            data={pieData}
                            donut
                            showGradient
                            sectionAutoFocus
                            radius={100}
                            innerRadius={60}
                            innerCircleColor={'#FFFFFF'}
                            centerLabelComponent={() => {
                                return (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text
                                            style={{ fontSize: 22, color: '#333333', fontWeight: 'bold' }}>
                                            {data.kpis.terrenosRegistrados}
                                        </Text>
                                        <Text style={{ fontSize: 14, color: '#666666' }}>Total</Text>
                                    </View>
                                );
                            }}
                        />
                        {/* Leyenda manual simple */}
                        <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {data.distribucionSuelo.map((item, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: getRandomColor(index), borderRadius: 5, marginRight: 5 }} />
                                    <Text style={{ color: 'gray', fontSize: 12 }}>{item.tipo}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : (
                    <Text style={{ color: 'gray' }}>No hay datos de distribución</Text>
                )}
            </View>

            {/* Lista de Registros Recientes */}
            <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Terrenos Recientes</Text>
                {data.terrenosRecientes.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                        <View style={styles.listContent}>
                            <Text style={styles.listTitle}>{item.zona}</Text>
                            <Text style={styles.listSubtitle}>{item.area} hectáreas</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.suelo}</Text>
                        </View>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
};

// Componente auxiliar para tarjeta KPI
interface KpiProps {
    title: string;
    value: string;
}
const KpiCard = ({ title, value }: KpiProps) => (
    <View style={styles.kpiCard}>
        <Text style={styles.kpiTitle}>{title}</Text>
        <Text style={styles.kpiValue}>{value}</Text>
    </View>
);

// Función auxiliar para colores
const getRandomColor = (index: number) => {
    const colors = ['#4ABFF4', '#79C285', '#FFC04C', '#ED6665', '#9D4EDD', '#F72585'];
    return colors[index % colors.length];
};

export default DashboardScreen;
