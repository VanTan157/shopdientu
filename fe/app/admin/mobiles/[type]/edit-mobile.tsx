import { Mobile } from "@/lib/types/mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPatch } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

interface EditMobileProps {
  mobile: Mobile;
  children: React.ReactNode;
}

const EditMobile = ({ mobile, children }: EditMobileProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: mobile.name,
    StartingPrice: mobile.StartingPrice,
    promotion: mobile.promotion,
    description: mobile.description || "",
    mobile_type_id: mobile.mobile_type_id._id || "",
    specifications: {
      screenSize: mobile.specifications.screenSize || "",
      resolution: mobile.specifications.resolution || "",
      cpu: mobile.specifications.cpu || "",
      ram: mobile.specifications.ram || "",
      storage: mobile.specifications.storage || "",
      battery: mobile.specifications.battery || "",
      os: mobile.specifications.os || "",
    },
    colorVariants: mobile.colorVariants.map((variant) => ({
      color: variant.color,
      image: null as File | null,
      stock: variant.stock,
      existingImage: variant.image || "",
    })),
    camera: {
      rear: mobile.camera.rear || "",
      front: mobile.camera.front || "",
    },
    weight: mobile.weight || 0,
    tags: mobile.tags || [],
  });
  const [imagePreview, setImagePreview] = useState<string[]>(
    mobile.colorVariants.map((variant) =>
      variant.image
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.image}`
        : ""
    )
  );
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreview]);

  const handleUpdateMobile = async () => {
    setIsLoading(true);

    if (!formData.name.trim()) {
      toast.error("Tên điện thoại không được để trống!");
      setIsLoading(false);
      return;
    }
    if (
      typeof formData.StartingPrice !== "number" ||
      isNaN(formData.StartingPrice) ||
      formData.StartingPrice <= 0
    ) {
      toast.error("Giá gốc phải là số lớn hơn 0!");
      setIsLoading(false);
      return;
    }
    if (
      typeof formData.promotion !== "number" ||
      isNaN(formData.promotion) ||
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
    if (!formData.mobile_type_id) {
      toast.error("Loại điện thoại không được để trống!");
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
      !formData.colorVariants.length ||
      formData.colorVariants.some(
        (v) =>
          !v.color.trim() ||
          v.stock === undefined ||
          isNaN(Number(v.stock)) ||
          Number(v.stock) < 0 ||
          (!v.image && !v.existingImage)
      )
    ) {
      toast.error(
        "Mỗi biến thể màu phải có tên, ảnh (hoặc ảnh hiện tại), và số lượng tồn kho hợp lệ!"
      );
      setIsLoading(false);
      return;
    }
    if (!formData.camera.rear.trim() || !formData.camera.front.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin camera!");
      setIsLoading(false);
      return;
    }
    if (
      typeof formData.weight !== "number" ||
      isNaN(formData.weight) ||
      formData.weight <= 0
    ) {
      toast.error("Trọng lượng phải là số lớn hơn 0!");
      setIsLoading(false);
      return;
    }
    if (formData.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      toast.error("Tag không hợp lệ!");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("StartingPrice", formData.StartingPrice.toString());
      formDataToSend.append("promotion", formData.promotion.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append("mobile_type_id", formData.mobile_type_id);
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
        formDataToSend.append(
          `colorVariants[${index}][existingImage]`,
          variant.existingImage
        );
        if (variant.image) {
          formDataToSend.append("images", variant.image);
          formDataToSend.append(`colorVariants[${index}][hasNewImage]`, "true");
        }
      });

      const response = await apiPatch<Mobile, FormData>(
        `/mobiles/${mobile._id}`,
        formDataToSend
      );

      if (response.error) throw new Error(response.error);

      toast.success("Cập nhật điện thoại thành công!");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật điện thoại!");
    } finally {
      setIsLoading(false);
    }
  };

  const addColorVariant = () => {
    setFormData({
      ...formData,
      colorVariants: [
        ...formData.colorVariants,
        { color: "", image: null, stock: 0, existingImage: "" },
      ],
    });
    setImagePreview((prev) => [...prev, ""]);
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] !max-w-[90%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chỉnh sửa điện thoại: {mobile.name}
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

          {/* Thông số kỹ thuật */}
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

          {/* Biến thể màu */}
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
                  {(variant.existingImage || imagePreview[index]) && (
                    <Image
                      src={
                        imagePreview[index]
                          ? imagePreview[index]
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.existingImage}`
                      }
                      alt={variant.color}
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
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateMobile}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMobile;
