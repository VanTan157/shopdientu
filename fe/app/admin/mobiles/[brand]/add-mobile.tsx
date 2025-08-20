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
import { IMobile } from "@/lib/types/mobile";

const AddMobileForm = ({ brands }: { brands?: string[] }) => {
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
      screenSize: 0,
      resolution: "",
      refreshRate: 0,
      simType: "",
      ram: 0,
      storage: 0,
      battery: 0,
      os: "",
      camera: {
        rear: "",
        front: "",
      },
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

  const handleAddMobile = async () => {
    start();

    // Validate dữ liệu
    if (!formData.name.trim()) {
      toast.error("Tên điện thoại không được để trống!");
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
      specs.screenSize <= 0 ||
      !specs.resolution.trim() ||
      specs.refreshRate <= 0 ||
      !specs.simType.trim() ||
      specs.ram <= 0 ||
      specs.storage <= 0 ||
      specs.battery <= 0 ||
      !specs.os.trim() ||
      !specs.camera.rear.trim() ||
      !specs.camera.front.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông số kỹ thuật!");
      stop();
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
      stop();
      return;
    }
    if (formData.dimensions.weight <= 0) {
      toast.error("Trọng lượng phải lớn hơn 0!");
      stop();
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("startingPrice", formData.startingPrice.toString());
      formDataToSend.append("promotion", formData.promotion.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );
      formDataToSend.append(
        "accessories",
        JSON.stringify(formData.accessories)
      );
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
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

      const response = await apiPost<IMobile, FormData>(
        "/mobiles",
        formDataToSend,
        undefined,
        ["mobiles"]
      );

      if (response.error) toast.error(response.error);

      toast.success("Thêm điện thoại thành công!");
      router.refresh();
      setIsOpen(false);
      // Reset form
      setFormData({
        name: "",
        startingPrice: 0,
        promotion: 0,
        description: "",
        brand: "",
        specifications: {
          screenSize: 0,
          resolution: "",
          refreshRate: 0,
          simType: "",
          ram: 0,
          storage: 0,
          battery: 0,
          os: "",
          camera: {
            rear: "",
            front: "",
          },
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
    } catch (error) {
      toast.error("Có lỗi khi thêm điện thoại!");
      console.error(error);
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
              type="number"
              value={formData.startingPrice || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startingPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập giá gốc"
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
              type="number"
              min="0"
              max="100"
              value={formData.promotion || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promotion: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập % khuyến mãi (nếu có)"
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
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Brand */}
          {!isAddingNewBrand ? (
            <div>
              <Label htmlFor="brand" className="text-gray-700 font-medium mb-2">
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
                  Tạo brand mới
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="brand" className="text-gray-700 font-medium mb-2">
                Thương hiệu mới
              </Label>
              <div className="flex gap-2">
                <Input
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

          {/* Specifications */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">
              Thông số kỹ thuật
            </Label>

            {/* Screen Size */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Kích thước màn hình (inch)
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="6.1"
                value={formData.specifications.screenSize || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      screenSize: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Resolution */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Độ phân giải
              </Label>
              <Input
                placeholder="1170 x 2532 pixels"
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
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Refresh Rate */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Tần số quét (Hz)
              </Label>
              <Input
                type="number"
                placeholder="60"
                value={formData.specifications.refreshRate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      refreshRate: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* SIM Type */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Loại SIM
              </Label>
              <Input
                placeholder="Nano SIM"
                value={formData.specifications.simType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      simType: e.target.value,
                    },
                  })
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* RAM */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                RAM (GB)
              </Label>
              <Input
                type="number"
                placeholder="8"
                value={formData.specifications.ram || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      ram: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Storage */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Bộ nhớ (GB)
              </Label>
              <Input
                type="number"
                placeholder="128"
                value={formData.specifications.storage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      storage: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Battery */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Pin (mAh)
              </Label>
              <Input
                type="number"
                placeholder="3000"
                value={formData.specifications.battery || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      battery: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* OS */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Hệ điều hành
              </Label>
              <Input
                placeholder="iOS 15"
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
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Camera */}
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Camera sau
              </Label>
              <Input
                placeholder="12MP + 12MP"
                value={formData.specifications.camera.rear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      camera: {
                        ...formData.specifications.camera,
                        rear: e.target.value,
                      },
                    },
                  })
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Camera trước
              </Label>
              <Input
                placeholder="12MP"
                value={formData.specifications.camera.front}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      camera: {
                        ...formData.specifications.camera,
                        front: e.target.value,
                      },
                    },
                  })
                }
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">
              Kích thước và trọng lượng
            </Label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Chiều dài (mm)
                </Label>
                <Input
                  type="number"
                  step="0.1"
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Chiều rộng (mm)
                </Label>
                <Input
                  type="number"
                  step="0.1"
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Chiều cao (mm)
                </Label>
                <Input
                  type="number"
                  step="0.1"
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Trọng lượng (g)
                </Label>
                <Input
                  type="number"
                  step="0.1"
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Warranty */}
          <div>
            <Label
              htmlFor="warranty"
              className="text-gray-700 font-medium mb-2"
            >
              Bảo hành
            </Label>
            <Input
              id="warranty"
              value={formData.warranty}
              onChange={(e) =>
                setFormData({ ...formData, warranty: e.target.value })
              }
              placeholder="12 tháng"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
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
                  className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex-1">
                  {imagePreview[index] && (
                    <Image
                      src={imagePreview[index]}
                      alt={variant.color || "Preview"}
                      width={100}
                      height={100}
                      className="object-contain rounded-md mb-2"
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
                  />
                </div>
                <Input
                  type="number"
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
              variant="outline"
              onClick={addColorVariant}
              className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm màu
            </Button>
          </div>

          {/* Accessories */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-2">Phụ kiện</Label>
            <div className="flex gap-2">
              <Input
                value={accessoryInput}
                onChange={(e) => setAccessoryInput(e.target.value)}
                placeholder="Nhập phụ kiện và nhấn Thêm"
                onKeyDown={(e) => e.key === "Enter" && handleAddAccessory()}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddAccessory}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.accessories.map((accessory, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {accessory}
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
                    ×
                  </button>
                </span>
              ))}
            </div>
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
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddTag}
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
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Nút submit */}
          <Button
            onClick={handleAddMobile}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Thêm điện thoại
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMobileForm;
