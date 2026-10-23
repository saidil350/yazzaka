import type { AdmissionFeeItem } from "@/lib/types";

// Satuan pendidikan untuk pengelompokan tabel biaya PPDB, dalam urutan tampil.
// Nilai disimpan apa adanya di jsonb admission_info.fees[].unit.
export const FEE_UNITS = [
  "Umum (Semua Unit)",
  "TPA",
  "TKIT",
  "Sekolah Anak Shalih",
  "PKBM",
  "Darul Quran",
  "Pesantren Peradaban 6.0",
] as const;

export type FeeUnit = (typeof FEE_UNITS)[number];

export const DEFAULT_FEE_UNIT: FeeUnit = "Umum (Semua Unit)";

const UNIT_ORDER: string[] = [...FEE_UNITS, "Lainnya"];

export function feeUnitLabel(unit?: string): string {
  if (!unit) return DEFAULT_FEE_UNIT;
  return (FEE_UNITS as readonly string[]).includes(unit) ? unit : "Lainnya";
}

export interface FeeGroup {
  unit: string;
  // index = posisi butir di array fees asli, dipakai tombol hapus di admin.
  items: { fee: AdmissionFeeItem; index: number }[];
}

// Kelompokkan biaya per satuan pendidikan mengikuti urutan FEE_UNITS;
// nilai di luar daftar masuk grup "Lainnya" di posisi terakhir.
export function groupFeesByUnit(fees: AdmissionFeeItem[]): FeeGroup[] {
  const groups = new Map<string, FeeGroup>();
  fees.forEach((fee, index) => {
    const unit = feeUnitLabel(fee.unit);
    let group = groups.get(unit);
    if (!group) {
      group = { unit, items: [] };
      groups.set(unit, group);
    }
    group.items.push({ fee, index });
  });
  return UNIT_ORDER.filter((unit) => groups.has(unit)).map(
    (unit) => groups.get(unit) as FeeGroup,
  );
}

// Tampilkan sub-header kelompok hanya jika ada butir di luar grup Umum —
// data lama/umum tidak perlu header "Umum (Semua Unit)" yang berulang.
export function isFeeGrouped(fees: AdmissionFeeItem[]): boolean {
  return fees.some((fee) => feeUnitLabel(fee.unit) !== DEFAULT_FEE_UNIT);
}
