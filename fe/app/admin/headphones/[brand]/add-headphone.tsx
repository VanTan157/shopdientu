"use client";

import { apiPost } from "@/lib/api";
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
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { loadingStore } from "@/app/store/loading.store";
import { IHeadphone } from "@/lib/types/headphone";

const AddHeadphoneForm = ({ brands }: { brands?: string[] }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { start, stop } = loadingStore();
  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startingPrice: 0,
    promotion: 0,
    description: "",
    brand: "",
    specifications: {
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
    },
    colorVariants: [{ color: "", image: null as File | null, stock: 0 }],
    accessories: [] as string[],
    tags: [] as string[],
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
    },
    warranty: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [accessoryInput, setAccessoryInput] = useState("");
  const [imagePreview, setImagePreview] = useState([] as string[]);

  const handleAddHeadphone = async () => {
    start();
    if (!formData.name.trim()) {
      toast.error("Tên tai nghe không được để trống!");
      stop();
      return;
    }
    if (isNaN(Number(formData.startingPrice)) || formData.startingPrice <= 0) {
      toast.error("Giá gốc phải là số lớn hơn 0!");
      stop();
      return;
    }
    if (
      isNaN(Number(formData.promotion)) ||
      formData.promotion < 0 ||
      formData.promotion > 100
    ) {
      toast.error("Khuyến mãi phải là số từ 0 đến 100!");
      stop();
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Mô tả không được để trống!");
      stop();
      return;
    }
    if (!formData.brand.trim()) {
      toast.error("Vui lòng chọn thương hiệu!");
      stop();
      return;
    }
    const specs = formData.specifications;
    if (
      !specs.driverType.trim() ||
      specs.driverSize <= 0 ||
      !specs.frequencyRange.trim() ||
      specs.impedance <= 0 ||
      !specs.noiseCancellation.trim() ||
      specs.batteryLife <= 0 ||
      specs.chargingTime <= 0 ||
      !specs.chargingPort.trim() ||
      !specs.connectivity.trim()
    ) {
      toast.error("Tất cả thông số kỹ thuật phải được điền đầy đủ!");
      stop();
      return;
    }
    if (
      formData.dimensions.length <= 0 ||
      formData.dimensions.width <= 0 ||
      formData.dimensions.height <= 0 ||
      formData.dimensions.weight <= 0
    ) {
      toast.error("Kích thước và trọng lượng phải lớn hơn 0!");
      stop();
      return;
    }
    if (
      formData.colorVariants.some(
        (v) => !v.color.trim() || v.stock < 0 || !v.image
      )
    ) {
      toast.error(
        "Mỗi biến thể màu phải có tên, ảnh và số lượng tồn kho hợp lệ!"
      );
      stop();
      return;
    }
    if (!formData.warranty.trim()) {
      toast.error("Thông tin bảo hành không được để trống!");
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
          formData.colorVariants.map((variant) => ({
            color: variant.color,
            stock: variant.stock,
          }))
        )
      );

      formData.colorVariants.forEach((variant) => {
        if (variant.image) {
          formDataToSend.append("images", variant.image);
        }
      });

      const response = await apiPost<IHeadphone, FormData>(
        "/headphones",
        formDataToSend,
        undefined,
        ["headphones"]
      );

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Thêm sản phẩm thành công!");
        router.refresh();
        setIsOpen(false);
        setFormData({
          name: "",
          startingPrice: 0,
          promotion: 0,
          description: "",
          brand: "",
          specifications: {
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
          },
          colorVariants: [{ color: "", image: null, stock: 0 }],
          accessories: [],
          tags: [],
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            weight: 0,
          },
          warranty: "",
        });
        setTagInput("");
        setAccessoryInput("");
        setImagePreview([]);
        setIsAddingNewBrand(false);
      }
    } catch (error) {
      console.error("Error creating headphone:", error);
      toast.error("Có lỗi xảy ra khi tạo tai nghe mới");
    } finally {
      stop();
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
    setImagePreview([...imagePreview, ""]);
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

  const handleAddAccessory = () => {
    if (accessoryInput && !formData.accessories.includes(accessoryInput)) {
      setFormData({
        ...formData,
        accessories: [...formData.accessories, accessoryInput],
      });
      setAccessoryInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const removeAccessory = (index: number) => {
    setFormData({
      ...formData,
      accessories: formData.accessories.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => {
          const newPreview = [...prev];
          newPreview[index] = reader.result as string;
          return newPreview;
        });
      };
      reader.readAsDataURL(file);

      setFormData((prev) => {
        const newVariants = [...prev.colorVariants];
        newVariants[index] = { ...newVariants[index], image: file };
        return { ...prev, colorVariants: newVariants };
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Thêm tai nghe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !max-w-[90%] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Thêm tai nghe mới
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
                      <option value="">Chọn thương hiệu</option>
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
                        setFormData({ ...formData, brand: "" });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
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
                    type="number"
                    value={formData.startingPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startingPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
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
                    type="number"
                    value={formData.promotion || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        promotion: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
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
                  placeholder="Nhập mô tả sản phẩm"
                  rows={3}
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
                  placeholder="VD: 12 tháng"
                />
              </div>
            </div>
          </div>

          {/* Thông số kỹ thuật */}
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
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Biến thể màu
              </h3>
            </div>
            {formData.colorVariants.map((variant, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Màu {index + 1}</span>
                  {formData.colorVariants.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeColorVariant(index)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label
                      className="text-gray-700 font-medium mb-2"
                      htmlFor={`color-${index}`}
                    >
                      Tên màu
                    </Label>
                    <Input
                      required
                      id={`color-${index}`}
                      value={variant.color}
                      onChange={(e) => {
                        const newVariants = [...formData.colorVariants];
                        newVariants[index] = {
                          ...newVariants[index],
                          color: e.target.value,
                        };
                        setFormData({
                          ...formData,
                          colorVariants: newVariants,
                        });
                      }}
                      placeholder="VD: Đen, Trắng"
                    />
                  </div>
                  <div className="flex-1">
                    <Label
                      className="text-gray-700 font-medium mb-2"
                      htmlFor={`image-${index}`}
                    >
                      Ảnh sản phẩm
                    </Label>
                    {imagePreview[index] && (
                      <div className="mt-2">
                        <Image
                          src={imagePreview[index]}
                          alt={`Preview ${index}`}
                          width={100}
                          height={100}
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <Input
                      required
                      id={`image-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </div>
                  <div>
                    <Label
                      className="text-gray-700 font-medium mb-2"
                      htmlFor={`stock-${index}`}
                    >
                      Số lượng tồn kho
                    </Label>
                    <Input
                      required
                      id={`stock-${index}`}
                      type="number"
                      value={variant.stock || ""}
                      onChange={(e) => {
                        const newVariants = [...formData.colorVariants];
                        newVariants[index] = {
                          ...newVariants[index],
                          stock: parseInt(e.target.value) || 0,
                        };
                        setFormData({
                          ...formData,
                          colorVariants: newVariants,
                        });
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
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
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium mb-2">Phụ kiện</Label>
            <div className="flex space-x-2">
              <Input
                value={accessoryInput}
                onChange={(e) => setAccessoryInput(e.target.value)}
                placeholder="Nhập phụ kiện"
                onKeyPress={(e) => e.key === "Enter" && handleAddAccessory()}
              />
              <Button
                type="button"
                onClick={handleAddAccessory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.accessories.map((accessory, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {accessory}
                  <button
                    type="button"
                    onClick={() => removeAccessory(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-700">Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Nhập tag"
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleAddHeadphone}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Thêm tai nghe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHeadphoneForm;
