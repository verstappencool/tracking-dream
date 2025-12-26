import { TVProject } from "./types";

export const sampleProjects: TVProject[] = [
  {
    id: "1",
    title: "BINTANG MBG",
    subtitle: "Episode Ngaliyan SD",
    description: "Program variety show BINTANG MBG yang tayang di Garuda TV pukul 20.30",
    status: "editing",
    priority: "high",
    genre: "Variety Show",
    episode: 15,
    season: 2,
    assignedTo: "Tim Production A",
    dueDate: "2025-12-26",
    createdAt: "2024-12-20",
    progress: 60,
    stageProgress: {
      shooting: 100,
      editing: 60,
      selesai: 0,
      kirim: 0
    },
    channel: "Garuda TV",
    airTime: "20:30",
    editor: "Budi Santoso",
    notes: "Sedang dalam tahap editing untuk episode hari ini",
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
    description: "Serial horor misteri yang tayang di SCTV",
    status: "selesai",
    priority: "high",
    genre: "Horror/Drama",
    episode: 8,
    season: 1,
    assignedTo: "Tim Production B",
    dueDate: "2025-12-25",
    createdAt: "2024-12-18",
    progress: 95,
    stageProgress: {
      shooting: 100,
      editing: 100,
      selesai: 95,
      kirim: 0
    },
    channel: "SCTV",
    airTime: "21:00",
    notes: "Final review sebelum kirim",
    logs: [
      {
        stage: "shooting",
        timestamp: "2025-12-23T07:00:00",
        duration: 240,
        notes: "Shooting lokasi outdoor"
      },
      {
        stage: "editing",
        timestamp: "2025-12-24T09:00:00",
        duration: 360,
        notes: "Editing dan color grading"
      },
      {
        stage: "selesai",
        timestamp: "2025-12-25T10:00:00",
        notes: "Final review approved"
      }
    ]
  },
  {
    id: "3",
    title: "KOMPETISI MBG",
    subtitle: "Episode 1 - Audisi Jakarta",
    description: "Kompetisi talent show terbaru dari MBG Network",
    status: "kirim",
    priority: "high",
    genre: "Competition",
    episode: 1,
    season: 1,
    assignedTo: "Tim Production C",
    dueDate: "2025-12-20",
    createdAt: "2024-12-15",
    progress: 100,
    stageProgress: {
      shooting: 100,
      editing: 100,
      selesai: 100,
      kirim: 100
    },
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
    createdAt: "2024-12-18",
    progress: 90,
    stageProgress: {
      shooting: 100,
      editing: 100,
      selesai: 90,
      kirim: 0
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
    createdAt: "2024-12-24",
    progress: 60,
    stageProgress: {
      shooting: 100,
      editing: 60,
      selesai: 0,
      kirim: 0
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
    createdAt: "2024-12-26",
    progress: 25,
    stageProgress: {
      shooting: 25,
      editing: 0,
      selesai: 0,
      kirim: 0
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
    status: "kirim",
    priority: "urgent",
    genre: "News",
    episode: 120,
    season: 1,
    assignedTo: "Tim News",
    dueDate: "2025-12-25",
    createdAt: "2024-12-25",
    progress: 100,
    stageProgress: {
      shooting: 100,
      editing: 100,
      selesai: 100,
      kirim: 100
    },
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
        stage: "kirim",
        timestamp: "2025-12-25T16:00:00",
        notes: "Upload ke G Drive selesai"
      }
    ]
  },
];
