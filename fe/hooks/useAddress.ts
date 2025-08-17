import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useAddress() {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("/api/provinces");
        if (!res.ok) throw new Error("Failed to fetch provinces");
        const data = await res.json();
        setProvinces(data.results);
      } catch (e) {
        console.error(e);
        toast.error("Không thể tải danh sách tỉnh/thành phố!");
      }
    };
    fetchProvinces();
  }, []);

  // districts
  useEffect(() => {
    if (!province) return;
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`/api/districts/${province}`);
        if (!res.ok) throw new Error("Failed to fetch districts");
        const data = await res.json();
        setDistricts(data.results);
        setDistrict("");
        setWards([]);
      } catch (e) {
        console.error(e);
        toast.error("Không thể tải danh sách quận/huyện!");
      }
    };
    fetchDistricts();
  }, [province]);

  // wards
  useEffect(() => {
    if (!district) return;
    const fetchWards = async () => {
      try {
        const res = await fetch(`/api/wards/${district}`);
        if (!res.ok) throw new Error("Failed to fetch wards");
        const data = await res.json();
        setWards(data.results);
        setWard("");
      } catch (e) {
        console.error(e);
        toast.error("Không thể tải danh sách phường/xã!");
      }
    };
    fetchWards();
  }, [district]);

  const getFullAddress = () => {
    const provinceName =
      provinces.find((p) => p.province_id === province)?.province_name || "";
    const districtName =
      districts.find((d) => d.district_id === district)?.district_name || "";
    const wardName = wards.find((w) => w.ward_id === ward)?.ward_name || "";
    return `${street}, ${wardName}, ${districtName}, ${provinceName}`;
  };

  return {
    provinces,
    districts,
    wards,
    province,
    setProvince,
    district,
    setDistrict,
    ward,
    setWard,
    street,
    setStreet,
    getFullAddress,
  };
}
