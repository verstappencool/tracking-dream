import type { TVProject } from "@/types/project";

export const sampleProjects: TVProject[] = [
  {
    id: "1",
    title: "BINTANG MBG",
    subtitle: "Wowok MBG",
    description: "Program variety show BINTANG MBG yang tayang di Garuda TV pukul 20.30",
    status: "editing",
    priority: "high",
    genre: "Variety Show",
    episode: 15,
    season: 2,
    assignedTo: "Tim Production A",
    dueDate: "2025-12-26",
    createdAt: "2026-01-16T09:30:00",
    progress: 60,
    stageProgress: {
      "pre-produksi": 100,
      shooting: 100,
      editing: 60,
      selesai: 0,
      payment: 0
    },
    channel: "Garuda TV",
    airTime: "20:30",
    editor: "Rusdi",
    notes: "Ayokk kerja",
    logs: [
      {
        stage: "shooting",
        timestamp: "2025-12-25T08:00:00",
        duration: 180,
        notes: "Shooting selesai pukul 11:00"
      },
      {
        stage: "editing",
        timestamp: "2025-12-25T13:00:00",
        notes: "Mulai editing"
      }
    ]
  },
  {
    id: "2",
    title: "PESAN DARI KUBUR",
    subtitle: "Ngawi Happy",
    description: "Ingin bertemu mas rusdi",
    status: "shooting",
    priority: "high",
    genre: "Horror/Drama",
    episode: 1,
    season: 1,
    assignedTo: "Pesan Surga",
    dueDate: "2025-12-25",
    createdAt: "2026-01-16T08:15:00",
    progress: 73,
    stageProgress: {
      "pre-produksi": 100,
      shooting: 73,
      editing: 0,
      selesai: 0,
      payment: 0
    },
    channel: "SCTV",
    airTime: "21:00",
    editor: "Farhan",
    notes: "Ayoo cikkk",
    logs: [
      {
        stage: "shooting",
        timestamp: "2025-12-23T07:00:00",
        duration: 240,
        notes: "Shooting lokasi outdoor"
      }
    ]
  },
  {
    id: "2b",
    title: "PESAN DARI KUBUR",
    subtitle: "Ngawi Happy 2",
    description: "Ingin bertemu mas rusdi",
    status: "shooting",
    priority: "high",
    genre: "Horror/Drama",
    episode: 2,
    season: 1,
    assignedTo: "Pesan Surga",
    dueDate: "2025-12-27",
    createdAt: "2026-01-16T10:45:00",
    progress: 31,
    stageProgress: {
      "pre-produksi": 100,
      shooting: 31,
      editing: 0,
      selesai: 0,
      payment: 0
    },
    channel: "SCTV",
    airTime: "21:00",
    editor: "Farhan",
    notes: "Ayoo Cikkk Part 2",
    logs: []
  },
  {
    id: "3",
    title: "KOMPETISI MBG",
    subtitle: "Episode 1 - Audisi Jakarta",
    description: "Kompetisi talent show terbaru dari MBG Network",
    status: "payment",
    priority: "high",
    genre: "Competition",
    episode: 1,
    season: 1,
    assignedTo: "Tim Production C",
    dueDate: "2025-12-20",
    createdAt: "2026-01-15T14:20:00",
    progress: 100,
    stageProgress: {
      "pre-produksi": 100,
      shooting: 100,
      editing: 100,
      selesai: 100,
      payment: 100
    },
    isPaid: true,
    paidAt: "2026-01-15T18:00:00",
    channel: "MBG Network",
    airTime: "19:00",
    editor: "Andi Wijaya",
    notes: "Episode pertama sudah tayang"
  },
  {
    id: "3b",
    title: "KOMPETISI MBG",
    subtitle: "Episode 2 - Audisi Bandung",
    description: "Kompetisi talent show terbaru dari MBG Network",
    status: "selesai",
    priority: "high",
    genre: "Competition",
    episode: 2,
    season: 1,
    assignedTo: "Tim Production C",
    dueDate: "2025-12-23",
    createdAt: "2026-01-15T16:00:00",
    progress: 90,
    stageProgress: {
      "pre-produksi": 100,
      shooting: 100,
      editing: 100,
      selesai: 90,
      payment: 0
    },
    channel: "MBG Network",
    airTime: "19:00",
    editor: "Andi Wijaya",
    notes: "Final review"
  },
  {
    id: "3c",
    title: "KOMPETISI MBG",
    subtitle: "Episode 3 - Audisi Surabaya",
    description: "Kompetisi talent show terbaru dari MBG Network",
    status: "editing",
    priority: "urgent",
    genre: "Competition",
    episode: 3,
    season: 1,
    assignedTo: "Tim Production C",
    dueDate: "2025-12-27",
    createdAt: "2026-01-16T07:30:00",
    progress: 60,
    stageProgress: {
      "pre-produksi": 100,
      shooting: 100,
      editing: 60,
      selesai: 0,
      payment: 0
    },
    channel: "MBG Network",
    airTime: "19:00",
    editor: "Andi Wijaya",
    notes: "Sedang proses editing"
  },
  {
    id: "3d",
    title: "KOMPETISI MBG",
    subtitle: "Episode 4 - Semifinal",
    description: "Kompetisi talent show terbaru dari MBG Network",
    status: "shooting",
    priority: "urgent",
    genre: "Competition",
    episode: 4,
    season: 1,
    assignedTo: "Tim Production C",
    dueDate: "2025-12-30",
    createdAt: "2026-01-16T11:15:00",
    progress: 25,
    stageProgress: {
      "pre-produksi": 100,
      shooting: 25,
      editing: 0,
      selesai: 0,
      payment: 0
    },
    channel: "MBG Network",
    airTime: "19:00",
    editor: "Andi Wijaya",
    notes: "Live shooting audisi babak semifinal"
  },
  {
    id: "4",
    title: "HEADLINE NEWS",
    description: "Berita utama harian yang tayang di YouTube channel",
    status: "payment",
    priority: "urgent",
    genre: "News",
    episode: 120,
    season: 1,
    assignedTo: "Tim News",
    dueDate: "2025-12-25",
    createdAt: "2026-01-16T12:00:00",
    progress: 100,
    stageProgress: {
      "pre-produksi": 100,
      shooting: 100,
      editing: 100,
      selesai: 100,
      payment: 100
    },
    isPaid: false,
    channel: "YouTube",
    airTime: "18:00",
    notes: "Sudah dikirim ke G Drive, siap upload",
    logs: [
      {
        stage: "shooting",
        timestamp: "2025-12-25T12:00:00",
        duration: 45,
        notes: "Shooting berita di studio"
      },
      {
        stage: "editing",
        timestamp: "2025-12-25T13:30:00",
        duration: 90,
        notes: "Editing cepat untuk berita hari ini"
      },
      {
        stage: "selesai",
        timestamp: "2025-12-25T15:30:00",
        notes: "Final check selesai"
      },
      {
        stage: "payment",
        timestamp: "2025-12-25T16:00:00",
        notes: "Menunggu pembayaran"
      }
    ]
  },
];
