"use client";

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
import { apiPost } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { loadingStore } from "@/app/store/loading.store";
import { ITablet } from "@/lib/types/tablet";

const AddTabletForm = ({ brands }: { brands?: string[] }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { start, stop } = loadingStore();
  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    startingPrice: 0,
    promotion: 0,
    description: "",
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
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
    },
    accessories: [] as string[],
    warranty: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [accessoryInput, setAccessoryInput] = useState("");
  const [imagePreview, setImagePreview] = useState([] as string[]);

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  const handleAddTablet = async () => {
    start();
    if (!formData.name.trim()) {
      toast.error("Tên tablet không được để trống!");
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
    const specs = formData.specifications;
    if (
      !specs.screenSize ||
      !specs.resolution.trim() ||
      !specs.refreshRate ||
      !specs.simType.trim() ||
      !specs.ram ||
      !specs.storage ||
      !specs.battery ||
      !specs.os.trim() ||
      !specs.camera.rear.trim() ||
      !specs.camera.front.trim()
    ) {
      toast.error("Tất cả thông số kỹ thuật phải được điền đầy đủ!");
      stop();
      return;
    }
    if (
      isNaN(Number(formData.dimensions.height)) ||
      Number(formData.dimensions.height) <= 0 ||
      isNaN(Number(formData.dimensions.width)) ||
      Number(formData.dimensions.width) <= 0 ||
      isNaN(Number(formData.dimensions.length)) ||
      Number(formData.dimensions.length) <= 0 ||
      isNaN(Number(formData.dimensions.weight)) ||
      Number(formData.dimensions.weight) <= 0
    ) {
      toast.error("Kích thước và trọng lượng phải là số lớn hơn 0!");
      stop();
      return;
    }
    if (
      formData.colorVariants.some(
        (v) =>
          !v.color.trim() ||
          v.stock === undefined ||
          isNaN(Number(v.stock)) ||
          Number(v.stock) < 0 ||
          !v.image
      )
    ) {
      toast.error(
        "Mỗi biến thể màu phải có tên, ảnh và số lượng tồn kho hợp lệ!"
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

      const response = await apiPost<ITablet, FormData>(
        "/tablets",
        formDataToSend,
        undefined,
        ["tablets"]
      );

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Thêm sản phẩm thành công!");
        router.refresh();
        setIsOpen(false);
        setFormData({
          name: "",
          brand: "",
          startingPrice: 0,
          promotion: 0,
          description: "",
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
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            weight: 0,
          },
          accessories: [],
          warranty: "",
          tags: [],
          colorVariants: [{ color: "", image: null, stock: 0 }],
        });
        setTagInput("");
        setAccessoryInput("");
        setImagePreview([]);
      }
    } catch (error) {
      console.error("Error creating tablet:", error);
      toast.error("Có lỗi xảy ra khi tạo tablet mới");
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Tablet
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] !max-w-[90%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Thêm Tablet Mới
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
                  htmlFor="name"
                  className="text-gray-700 font-medium mb-2"
                >
                  Tên tablet
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên tablet"
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Label
                  htmlFor="brand"
                  className="text-gray-700 font-medium mb-2"
                >
                  Thương hiệu
                </Label>
                <div className="flex gap-2 mt-1">
                  {!isAddingNewBrand ? (
                    <>
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
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>

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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Kích thước màn hình (inch)
                </Label>
                <Input
                  placeholder="Kích thước màn hình (inch)"
                  type="text"
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Tần số quét (Hz)
                </Label>
                <Input
                  placeholder="Tần số quét (Hz)"
                  type="text"
                  value={formData.specifications.refreshRate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        refreshRate: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Loại SIM
                </Label>
                <Input
                  placeholder="Loại SIM"
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  RAM (GB)
                </Label>
                <Input
                  placeholder="RAM (GB)"
                  type="text"
                  value={formData.specifications.ram || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        ram: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Bộ nhớ (GB)
                </Label>
                <Input
                  placeholder="Bộ nhớ (GB)"
                  type="text"
                  value={formData.specifications.storage || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        storage: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Pin (mAh)
                </Label>
                <Input
                  placeholder="Pin (mAh)"
                  type="text"
                  value={formData.specifications.battery || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        battery: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Camera sau
                </Label>
                <Input
                  placeholder="Camera sau"
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Camera trước
                </Label>
                <Input
                  placeholder="Camera trước"
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
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Kích thước và trọng lượng */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-4">
              Kích thước và trọng lượng
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <Label
                  htmlFor="length"
                  className="text-gray-700 font-medium mb-2"
                >
                  Chiều dài (mm)
                </Label>
                <Input
                  placeholder="Chiều dài"
                  type="text"
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
                <Label
                  htmlFor="width"
                  className="text-gray-700 font-medium mb-2"
                >
                  Chiều rộng (mm)
                </Label>
                <Input
                  placeholder="Chiều rộng"
                  type="text"
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
                <Label
                  htmlFor="height"
                  className="text-gray-700 font-medium mb-2"
                >
                  Chiều cao (mm)
                </Label>
                <Input
                  placeholder="Chiều cao"
                  type="text"
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
                <Label
                  htmlFor="weight"
                  className="text-gray-700 font-medium mb-2"
                >
                  Trọng lượng (g)
                </Label>
                <Input
                  placeholder="Trọng lượng"
                  type="text"
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

          {/* Biến thể màu */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">Biến thể màu</Label>
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
                      alt={variant.color}
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
              variant="outline"
              onClick={addColorVariant}
              className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Phụ kiện */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">Phụ kiện</Label>
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
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.accessories.map((acc, index) => (
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
            <Label className="text-gray-900 font-semibold">Tags</Label>
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
                <Plus className="w-4 h-4" />
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
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              onClick={handleAddTablet}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Thêm tablet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTabletForm;
