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
import { IHeadphone } from "@/lib/types/headphone";
import { apiPatch } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { loadingStore } from "@/app/store/loading.store";

const defaultSpecifications = {
  driverType: "",
  driverSize: 0,
  frequencyRange: "",
  impedance: 0,
  noiseCancellation: "",
  batteryLife: 0,
  chargingTime: 0,
  chargingPort: "",
  microphone: false,
  connectivity: "",
};

const EditHeadphone = ({
  headphone,
  brands,
  children,
}: {
  headphone: IHeadphone;
  brands: string[];
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { start, stop } = loadingStore();
  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
  const [formData, setFormData] = useState({
    name: headphone.name,
    brand: headphone.brand,
    startingPrice: headphone.startingPrice,
    promotion: headphone.promotion,
    description: headphone.description || "",
    specifications: {
      ...defaultSpecifications,
      ...headphone.specifications,
    },
    colorVariants: headphone.colorVariants.map((variant: any) => ({
      color: variant.color,
      image: null as File | null,
      stock: variant.stock,
      existingImage: variant.image || "",
      hasNewImage: "false",
    })),
    dimensions: {
      length: headphone.dimensions?.length || 0,
      width: headphone.dimensions?.width || 0,
      height: headphone.dimensions?.height || 0,
      weight: headphone.dimensions?.weight || 0,
    },
    accessories: headphone.accessories || [],
    warranty: headphone.warranty || "",
    tags: headphone.tags || [],
  });
  const [imagePreview, setImagePreview] = useState<string[]>(
    headphone.colorVariants.map((variant: any) =>
      variant.image
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.image}`
        : ""
    )
  );
  const [tagInput, setTagInput] = useState("");
  const [accessoryInput, setAccessoryInput] = useState("");

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleUpdateHeadphone = async () => {
    start();
    if (!formData.name.trim()) {
      toast.error("Tên tai nghe không được để trống!");
      stop();
      return;
    }
    if (!formData.brand.trim()) {
      toast.error("Thương hiệu không được để trống!");
      stop();
      return;
    }
    if (
      isNaN(Number(formData.startingPrice)) ||
      Number(formData.startingPrice) <= 0
    ) {
      toast.error("Giá gốc phải là số lớn hơn 0!");
      stop();
      return;
    }
    if (isNaN(Number(formData.promotion)) || Number(formData.promotion) < 0) {
      toast.error("Khuyến mãi phải là số không âm!");
      stop();
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Mô tả không được để trống!");
      stop();
      return;
    }
    if (!formData.warranty.trim()) {
      toast.error("Bảo hành không được để trống!");
      stop();
      return;
    }
    // Validate biến thể màu
    if (
      !Array.isArray(formData.colorVariants) ||
      formData.colorVariants.length === 0 ||
      formData.colorVariants.some(
        (v) =>
          !v.color.trim() ||
          isNaN(Number(v.stock)) ||
          Number(v.stock) < 0 ||
          (!v.image && !v.existingImage)
      )
    ) {
      toast.error(
        "Mỗi biến thể màu phải có tên, ảnh (hoặc ảnh hiện tại), và số lượng tồn kho hợp lệ!"
      );
      stop();
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("startingPrice", formData.startingPrice.toString());
      formDataToSend.append("promotion", formData.promotion.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataToSend.append(
        "accessories",
        JSON.stringify(formData.accessories)
      );
      formDataToSend.append("warranty", formData.warranty);
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      formDataToSend.append(
        "colorVariants",
        JSON.stringify(
          formData.colorVariants.map((variant: any) => ({
            color: variant.color,
            stock: variant.stock,
            existingImage: variant.existingImage,
            hasNewImage: variant.hasNewImage,
          }))
        )
      );

      formData.colorVariants.forEach((variant: any) => {
        if (variant.image) {
          formDataToSend.append("images", variant.image);
        }
      });

      const response = await apiPatch<IHeadphone, FormData>(
        `/headphones/${headphone._id}`,
        formDataToSend,
        undefined,
        ["headphones"]
      );

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Cập nhật tai nghe thành công!");
        router.refresh();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error updating headphone:", error);
      toast.error("Có lỗi khi cập nhật tai nghe!");
    } finally {
      stop();
    }
  };

  const addColorVariant = () => {
    setFormData({
      ...formData,
      colorVariants: [
        ...formData.colorVariants,
        {
          color: "",
          image: null,
          stock: 0,
          existingImage: "",
          hasNewImage: "false",
        },
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

  const handleAddConnectivity = () => {
    // connectivity được quản lý trong specifications.connectivity, không cần function riêng
  };

  const handleAddAccessory = () => {
    if (accessoryInput && !formData.accessories.includes(accessoryInput)) {
      setFormData({
        ...formData,
        accessories: [...formData.accessories, accessoryInput],
      });
      setAccessoryInput("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] !max-w-[90%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chỉnh sửa tai nghe: {headphone.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="name"
                >
                  Tên tai nghe
                </Label>
                <Input
                  required
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên tai nghe"
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {!isAddingNewBrand ? (
                <div>
                  <Label
                    className="text-gray-700 font-medium mb-2"
                    htmlFor="brand"
                  >
                    Thương hiệu
                  </Label>
                  <div className="flex gap-2">
                    <select
                      id="brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      {brands?.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingNewBrand(true)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Thêm thương hiệu mới
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Label
                    className="text-gray-700 font-medium mb-2"
                    htmlFor="brand"
                  >
                    Thương hiệu mới
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      required
                      id="brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="Nhập thương hiệu mới"
                      className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsAddingNewBrand(false);
                        setFormData({ ...formData, brand: headphone.brand });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="startingPrice"
                >
                  Giá gốc (VNĐ)
                </Label>
                <Input
                  required
                  id="startingPrice"
                  type="text"
                  value={formData.startingPrice || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startingPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Nhập giá gốc"
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="promotion"
                >
                  Khuyến mãi (%)
                </Label>
                <Input
                  required
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="description"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="warranty"
                >
                  Bảo hành
                </Label>
                <Input
                  required
                  id="warranty"
                  value={formData.warranty}
                  onChange={(e) =>
                    setFormData({ ...formData, warranty: e.target.value })
                  }
                  placeholder="Nhập thời gian bảo hành"
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-2 gap-4 ">
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="driverType"
                >
                  Loại driver
                </Label>
                <Input
                  required
                  id="driverType"
                  value={formData.specifications.driverType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        driverType: e.target.value,
                      },
                    })
                  }
                  placeholder="VD: Dynamic"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="driverSize"
                >
                  Kích thước driver (mm)
                </Label>
                <Input
                  required
                  id="driverSize"
                  type="number"
                  value={formData.specifications.driverSize || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        driverSize: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="40"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="frequencyRange"
                >
                  Dải tần số
                </Label>
                <Input
                  required
                  id="frequencyRange"
                  value={formData.specifications.frequencyRange}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        frequencyRange: e.target.value,
                      },
                    })
                  }
                  placeholder="20Hz - 20kHz"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="impedance"
                >
                  Trở kháng (Ω)
                </Label>
                <Input
                  required
                  id="impedance"
                  type="number"
                  value={formData.specifications.impedance || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        impedance: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="32"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="noiseCancellation"
                >
                  Chống ồn
                </Label>
                <Input
                  required
                  id="noiseCancellation"
                  value={formData.specifications.noiseCancellation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        noiseCancellation: e.target.value,
                      },
                    })
                  }
                  placeholder="ANC, Passive"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="batteryLife"
                >
                  Thời lượng pin (giờ)
                </Label>
                <Input
                  required
                  id="batteryLife"
                  type="number"
                  value={formData.specifications.batteryLife || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        batteryLife: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="20"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="chargingTime"
                >
                  Thời gian sạc (giờ)
                </Label>
                <Input
                  required
                  id="chargingTime"
                  type="number"
                  value={formData.specifications.chargingTime || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        chargingTime: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="2"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="chargingPort"
                >
                  Cổng sạc
                </Label>
                <Input
                  required
                  id="chargingPort"
                  value={formData.specifications.chargingPort}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        chargingPort: e.target.value,
                      },
                    })
                  }
                  placeholder="USB-C, Lightning"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="connectivity"
                >
                  Kết nối
                </Label>
                <Input
                  required
                  id="connectivity"
                  value={formData.specifications.connectivity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        connectivity: e.target.value,
                      },
                    })
                  }
                  placeholder="Bluetooth 5.0, 3.5mm jack"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  required
                  type="checkbox"
                  id="microphone"
                  checked={formData.specifications.microphone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        microphone: e.target.checked,
                      },
                    })
                  }
                />
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="microphone"
                >
                  Có microphone
                </Label>
              </div>
            </div>
          </div>

          {/* Kích thước */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Kích thước & Trọng lượng
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="length"
                >
                  Chiều dài (mm)
                </Label>
                <Input
                  required
                  id="length"
                  type="number"
                  value={formData.dimensions.length || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        length: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="width"
                >
                  Chiều rộng (mm)
                </Label>
                <Input
                  required
                  id="width"
                  type="number"
                  value={formData.dimensions.width || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        width: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="height"
                >
                  Chiều cao (mm)
                </Label>
                <Input
                  required
                  id="height"
                  type="number"
                  value={formData.dimensions.height || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        height: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label
                  className="text-gray-700 font-medium mb-2"
                  htmlFor="weight"
                >
                  Trọng lượng (g)
                </Label>
                <Input
                  required
                  id="weight"
                  type="number"
                  value={formData.dimensions.weight || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dimensions: {
                        ...formData.dimensions,
                        weight: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Biến thể màu */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Biến thể màu
            </h3>
            {formData.colorVariants.map((variant, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm"
              >
                <Input
                  required
                  placeholder="Tên màu"
                  value={variant.color}
                  onChange={(e) => {
                    const newVariants = [...formData.colorVariants];
                    newVariants[index].color = e.target.value;
                    setFormData({ ...formData, colorVariants: newVariants });
                  }}
                  className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex-1">
                  {(variant.existingImage || imagePreview[index]) && (
                    <Image
                      src={
                        imagePreview[index]
                          ? imagePreview[index]
                          : variant.existingImage
                      }
                      alt={variant.color}
                      width={100}
                      height={100}
                      className="object-contain rounded-md"
                    />
                  )}
                  <Input
                    required
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      const newVariants = [...formData.colorVariants];
                      newVariants[index].image = file;
                      newVariants[index].hasNewImage = file ? "true" : "false";
                      setFormData({ ...formData, colorVariants: newVariants });
                      if (file) {
                        setImagePreview((prev) => {
                          const updatedPreviews = [...prev];
                          updatedPreviews[index] = URL.createObjectURL(file);
                          return updatedPreviews;
                        });
                      }
                    }}
                    className="mt-2"
                  />
                </div>
                <Input
                  required
                  type="text"
                  placeholder="Tồn kho"
                  value={variant.stock || ""}
                  onChange={(e) => {
                    const newVariants = [...formData.colorVariants];
                    newVariants[index].stock = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, colorVariants: newVariants });
                  }}
                  className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.colorVariants.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeColorVariant(index)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={addColorVariant}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Phụ kiện */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-700 font-medium mb-2">Phụ kiện</Label>
            <div className="flex gap-2">
              <Input
                value={accessoryInput}
                onChange={(e) => setAccessoryInput(e.target.value)}
                placeholder="Nhập phụ kiện và nhấn Thêm"
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddAccessory}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.accessories.map((acc: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {acc}
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        accessories: formData.accessories.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                    className="text-red-600"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-700 font-medium mb-2">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Nhập tag và nhấn Thêm"
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddTag}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter(
                          (_: any, i: number) => i !== index
                        ),
                      })
                    }
                    className="text-red-600"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateHeadphone}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditHeadphone;
