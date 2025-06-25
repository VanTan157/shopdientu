"use client";

import { apiPost } from "@/lib/api";
import { Mobile, MobileType } from "@/lib/types/mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

interface AddMobileFormProps {
  type?: string;
  mobileTypes?: MobileType[];
}

const AddMobileForm = ({ type, mobileTypes }: AddMobileFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileType, setMobileType] = useState<boolean>(false);
  const [newMobileType, setNewMobileType] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    StartingPrice: 0,
    promotion: 0,
    description: "",
    mobile_type_id: "",
    specifications: {
      screenSize: "",
      resolution: "",
      cpu: "",
      ram: "",
      storage: "",
      battery: "",
      os: "",
    },
    colorVariants: [{ color: "", image: null as File | null, stock: 0 }],
    camera: { rear: "", front: "" },
    weight: 0,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState([] as string[]);

  const handleAddMobileType = async () => {};

  const handleAddMobile = async () => {
    setIsLoading(true);

    // Validate dữ liệu
    if (!formData.name.trim()) {
      toast.error("Tên điện thoại không được để trống!");
      setIsLoading(false);
      return;
    }
    if (isNaN(Number(formData.StartingPrice))) {
      toast.error("Giá gốc phải là một số hợp lệ!");
      setIsLoading(false);
      return;
    }
    if (formData.StartingPrice <= 0) {
      toast.error("Giá gốc phải lớn hơn 0!");
      setIsLoading(false);
      return;
    }
    if (
      isNaN(Number(formData.promotion)) ||
      formData.promotion < 0 ||
      formData.promotion > 100
    ) {
      toast.error("Khuyến mãi phải là số từ 0 đến 100!");
      setIsLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Mô tả không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.mobile_type_id && !mobileType) {
      toast.error("Vui lòng chọn loại điện thoại!");
      setIsLoading(false);
      return;
    }
    if (mobileType && !newMobileType.trim()) {
      toast.error("Vui lòng nhập loại điện thoại mới!");
      setIsLoading(false);
      return;
    }
    const specs = formData.specifications;
    if (
      !specs.screenSize.trim() ||
      !specs.resolution.trim() ||
      !specs.cpu.trim() ||
      !specs.ram.trim() ||
      !specs.storage.trim() ||
      !specs.battery.trim() ||
      !specs.os.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông số kỹ thuật!");
      setIsLoading(false);
      return;
    }
    if (
      formData.colorVariants.some(
        (v) =>
          !v.color.trim() || v.stock < 0 || isNaN(Number(v.stock)) || !v.image
      )
    ) {
      toast.error(
        "Mỗi biến thể màu phải có tên, ảnh và số lượng tồn kho hợp lệ!"
      );
      setIsLoading(false);
      return;
    }
    if (!formData.camera.rear.trim() || !formData.camera.front.trim()) {
      toast.error("Vui lòng nhập thông tin camera trước và sau!");
      setIsLoading(false);
      return;
    }
    if (isNaN(Number(formData.weight)) || formData.weight <= 0) {
      toast.error("Trọng lượng phải là số lớn hơn 0!");
      setIsLoading(false);
      return;
    }

    try {
      let mobileTypeId;
      if (mobileType) {
        const res = await apiPost<MobileType, {}>("/mobile-types", {
          type: newMobileType,
        });
        if (!res.data) {
          throw new Error("Không nhận được dữ liệu loại điện thoại mới!");
        }
        mobileTypeId = res.data._id;
        toast.success("Thêm loại điện thoại mới thành công!");
      }
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("StartingPrice", formData.StartingPrice.toString());
      formDataToSend.append("promotion", formData.promotion.toString());
      formDataToSend.append("description", formData.description);
      mobileType && mobileTypeId
        ? formDataToSend.append("mobile_type_id", mobileTypeId)
        : formDataToSend.append("mobile_type_id", formData.mobile_type_id);
      formDataToSend.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );
      formDataToSend.append("camera", JSON.stringify(formData.camera));
      formDataToSend.append("weight", formData.weight.toString());
      formDataToSend.append("tags", JSON.stringify(formData.tags));

      formData.colorVariants.forEach((variant, index) => {
        formDataToSend.append(`colorVariants[${index}][color]`, variant.color);
        formDataToSend.append(
          `colorVariants[${index}][stock]`,
          variant.stock.toString()
        );
        if (variant.image) {
          formDataToSend.append("images", variant.image);
        }
      });

      const response = await apiPost<Mobile, FormData>(
        "/mobiles",
        formDataToSend
      );

      if (response.error) throw new Error(response.error);

      toast.success("Thêm điện thoại thành công!");
      router.refresh();
      setIsOpen(false);
      setFormData({
        name: "",
        StartingPrice: 0,
        promotion: 0,
        description: "",
        mobile_type_id: "",
        specifications: {
          screenSize: "",
          resolution: "",
          cpu: "",
          ram: "",
          storage: "",
          battery: "",
          os: "",
        },
        colorVariants: [{ color: "", image: null, stock: 0 }],
        camera: { rear: "", front: "" },
        weight: 0,
        tags: [],
      });
      setTagInput("");
      setImagePreview([]);
      setMobileType(false);
      setNewMobileType("");
    } catch (error) {
      toast.error("Có lỗi khi thêm điện thoại!");
    } finally {
      setIsLoading(false);
    }
  };

  const addColorVariant = () => {
    setFormData({
      ...formData,
      colorVariants: [
        ...formData.colorVariants,
        { color: "", image: null, stock: 0 },
      ],
    });
  };

  const removeColorVariant = (index: number) => {
    setFormData({
      ...formData,
      colorVariants: formData.colorVariants.filter((_, i) => i !== index),
    });
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Thêm điện thoại mới
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] !max-w-[90%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Thêm điện thoại mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          {/* Tên */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium mb-2">
              Tên điện thoại
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên điện thoại"
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Giá gốc */}
          <div>
            <Label
              htmlFor="startingPrice"
              className="text-gray-700 font-medium mb-2"
            >
              Giá gốc (VNĐ)
            </Label>
            <Input
              id="startingPrice"
              type="text"
              value={formData.StartingPrice || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  StartingPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập giá gốc"
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Khuyến mãi */}
          <div>
            <Label
              htmlFor="promotion"
              className="text-gray-700 font-medium mb-2"
            >
              Khuyến mãi (%)
            </Label>
            <Input
              id="promotion"
              type="text"
              value={formData.promotion || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promotion: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập % khuyến mãi (nếu có)"
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <Label
              htmlFor="description"
              className="text-gray-700 font-medium mb-2"
            >
              Mô tả
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả"
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mobile Type ID (Select) */}
          {!mobileType ? (
            <div>
              <Label
                htmlFor="mobile_type_id"
                className="text-gray-700 font-medium mb-2"
              >
                Loại điện thoại
              </Label>
              <div className="flex gap-2">
                <select
                  id="mobile_type_id"
                  value={formData.mobile_type_id}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile_type_id: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn loại điện thoại</option>
                  {mobileTypes?.map((mt) => (
                    <option key={mt._id} value={mt._id}>
                      {mt.type} {mt.type === type && "(Hiện tại)"}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  onClick={() => setMobileType(true)}
                  disabled={isLoading}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Tạo type mới
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Label
                htmlFor="mobile_type_id"
                className="text-gray-700 font-medium mb-2"
              >
                Loại điện thoại
              </Label>
              <div className="flex gap-2">
                <Input
                  id="mobile_type_id"
                  value={newMobileType}
                  onChange={(e) => setNewMobileType(e.target.value)}
                  placeholder="Nhập loại điện thoại"
                  disabled={isLoading}
                  className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    setMobileType(false);
                    setNewMobileType("");
                  }}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}

          {/* Specifications */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">
              Thông số kỹ thuật
            </Label>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Kích thước màn hình
              </Label>
              <Input
                placeholder="Kích thước màn hình"
                value={formData.specifications.screenSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      screenSize: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Độ phân giải
              </Label>
              <Input
                placeholder="Độ phân giải"
                value={formData.specifications.resolution}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      resolution: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">CPU</Label>
              <Input
                placeholder="CPU"
                value={formData.specifications.cpu}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      cpu: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">RAM</Label>
              <Input
                placeholder="RAM"
                value={formData.specifications.ram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      ram: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Bộ nhớ
              </Label>
              <Input
                placeholder="Bộ nhớ"
                value={formData.specifications.storage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      storage: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">Pin</Label>
              <Input
                placeholder="Pin"
                value={formData.specifications.battery}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      battery: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Hệ điều hành
              </Label>
              <Input
                placeholder="Hệ điều hành"
                value={formData.specifications.os}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      os: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Color Variants */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">
              Biến thể màu
            </Label>
            {formData.colorVariants.map((variant, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm"
              >
                <Input
                  placeholder="Tên màu"
                  value={variant.color}
                  onChange={(e) => {
                    const newVariants = [...formData.colorVariants];
                    newVariants[index].color = e.target.value;
                    setFormData({ ...formData, colorVariants: newVariants });
                  }}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex-1">
                  {imagePreview[index] && (
                    <Image
                      src={imagePreview[index]}
                      alt={variant.color || "Preview"}
                      width={100}
                      height={100}
                      className="object-contain rounded-md"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      const newVariants = [...formData.colorVariants];
                      newVariants[index].image = file;
                      setFormData({ ...formData, colorVariants: newVariants });
                      if (file) {
                        setImagePreview((prev) => {
                          const updatedPreviews = [...prev];
                          updatedPreviews[index] = URL.createObjectURL(file);
                          return updatedPreviews;
                        });
                      }
                    }}
                    disabled={isLoading}
                    className="mt-2"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Tồn kho"
                  value={variant.stock || ""}
                  onChange={(e) => {
                    const newVariants = [...formData.colorVariants];
                    newVariants[index].stock = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, colorVariants: newVariants });
                  }}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.colorVariants.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeColorVariant(index)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addColorVariant}
              disabled={isLoading}
              className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm màu
            </Button>
          </div>

          {/* Camera */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">Camera</Label>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Camera sau
              </Label>
              <Input
                placeholder="Camera sau"
                value={formData.camera.rear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    camera: { ...formData.camera, rear: e.target.value },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Camera trước
              </Label>
              <Input
                placeholder="Camera trước"
                value={formData.camera.front}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    camera: { ...formData.camera, front: e.target.value },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Trọng lượng */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label htmlFor="weight" className="text-gray-700 font-medium mb-2">
              Trọng lượng (g)
            </Label>
            <Input
              id="weight"
              type="text"
              value={formData.weight || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weight: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập trọng lượng"
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Nhập tag và nhấn Thêm"
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddTag}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((_, i) => i !== index),
                      })
                    }
                    className="text-red-600"
                    disabled={isLoading}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Nút submit */}
          <Button
            onClick={handleAddMobile}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Thêm điện thoại"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMobileForm;
