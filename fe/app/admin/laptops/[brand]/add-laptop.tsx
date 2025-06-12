"use client";

import { apiPost } from "@/lib/api";
import { Laptop } from "@/lib/types/laptop";
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

interface AddLaptopFormProps {
  children?: React.ReactNode;
  brands?: string[]; // Danh sách thương hiệu
}

const AddLaptopForm = ({ children, brands = [] }: AddLaptopFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false); // Trạng thái nhập thương hiệu mới
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    startingPrice: 0,
    promotion: 0,
    description: "",
    specifications: {
      screenSize: "",
      resolution: "",
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      battery: "",
      os: "",
      refreshRate: "",
      keyboard: "",
      ports: [] as string[],
      webcam: "",
      audio: "",
    },
    colorVariants: [{ color: "", image: null as File | null, stock: 0 }],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    connectivity: [] as string[],
    accessories: [] as string[],
    warranty: "",
    tags: [] as string[],
    slug: "",
    sku: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [connectivityInput, setConnectivityInput] = useState("");
  const [accessoryInput, setAccessoryInput] = useState("");
  const [imagePreview, setImagePreview] = useState([] as string[]);

  const handleAddLaptop = async () => {
    setIsLoading(true);

    // Validate dữ liệu
    if (!formData.name) {
      toast.error("Tên laptop không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.brand) {
      toast.error("Thương hiệu không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.category) {
      toast.error("Danh mục không được để trống!");
      setIsLoading(false);
      return;
    }
    if (formData.startingPrice <= 0) {
      toast.error("Giá gốc phải lớn hơn 0!");
      setIsLoading(false);
      return;
    }
    if (
      formData.colorVariants.some((v) => !v.color || v.stock < 0 || !v.image)
    ) {
      toast.error(
        "Mỗi biến thể màu phải có tên, ảnh và số lượng tồn kho hợp lệ!"
      );
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("startingPrice", formData.startingPrice.toString());
      formDataToSend.append("promotion", formData.promotion.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );
      formDataToSend.append("weight", formData.weight.toString());
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataToSend.append(
        "connectivity",
        JSON.stringify(formData.connectivity)
      );
      formDataToSend.append(
        "accessories",
        JSON.stringify(formData.accessories)
      );
      formDataToSend.append("warranty", formData.warranty);
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

      formDataToSend.append("sku", formData.sku);
      formDataToSend.append("slug", formData.slug);

      const response = await apiPost<Laptop, FormData>(
        "/laptops",
        formDataToSend
      );

      if (response.error) throw new Error(response.error);

      toast.success("Thêm laptop thành công!");
      router.refresh();
      setIsOpen(false);
      setFormData({
        name: "",
        brand: "",
        category: "",
        startingPrice: 0,
        promotion: 0,
        description: "",
        specifications: {
          screenSize: "",
          resolution: "",
          cpu: "",
          gpu: "",
          ram: "",
          storage: "",
          battery: "",
          os: "",
          refreshRate: "",
          keyboard: "",
          ports: [],
          webcam: "",
          audio: "",
        },
        colorVariants: [{ color: "", image: null, stock: 0 }],
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
        },
        connectivity: [],
        accessories: [],
        warranty: "",
        tags: [],
        slug: "",
        sku: "",
      });
      setTagInput("");
      setConnectivityInput("");
      setAccessoryInput("");
      setImagePreview([]);
      setIsAddingNewBrand(false);
    } catch (error) {
      toast.error("Có lỗi khi thêm laptop!");
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

  const handleAddConnectivity = () => {
    if (
      connectivityInput &&
      !formData.connectivity.includes(connectivityInput)
    ) {
      setFormData({
        ...formData,
        connectivity: [...formData.connectivity, connectivityInput],
      });
      setConnectivityInput("");
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
        {children || (
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Thêm laptop mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90%] !max-w-[90%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Thêm laptop mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          {/* Tên */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Tên laptop
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên laptop"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Thương hiệu */}
          <div>
            <Label htmlFor="brand" className="text-gray-700 font-medium">
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
                    disabled={isLoading}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingNewBrand(true)}
                    disabled={isLoading}
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
                    disabled={isLoading}
                    className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNewBrand(false);
                      setFormData({ ...formData, brand: "" });
                    }}
                    disabled={isLoading}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <Label htmlFor="category" className="text-gray-700 font-medium">
              Danh mục
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="Nhập danh mục (ví dụ: Ultrabook, Gaming)"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Đường dẫn SEO */}
          <div>
            <Label htmlFor="slug" className="text-gray-700 font-medium">
              Đường dẫn SEO
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="Nhập đường dẫn SEO (ví dụ: laptop-dell-xps)"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-cond-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mã hàng hóa */}
          <div>
            <Label htmlFor="sku" className="text-gray-700 font-medium">
              Mã hàng hóa
            </Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              placeholder="Nhập mã hàng hóa (ví dụ: LT-DEL-001)"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Giá gốc */}
          <div>
            <Label
              htmlFor="startingPrice"
              className="text-gray-700 font-medium"
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
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Khuyến mãi */}
          <div>
            <Label htmlFor="promotion" className="text-gray-700 font-medium">
              Khuyến mãi (%)
            </Label>
            <Input
              id="promotion"
              type="number"
              value={formData.promotion || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promotion: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập % khuyến mãi (nếu có)"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <Label htmlFor="description" className="text-gray-700 font-medium">
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
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Bảo hành */}
          <div>
            <Label htmlFor="warranty" className="text-gray-700 font-medium">
              Bảo hành
            </Label>
            <Input
              id="warranty"
              value={formData.warranty}
              onChange={(e) =>
                setFormData({ ...formData, warranty: e.target.value })
              }
              placeholder="Nhập thời gian bảo hành (ví dụ: 12 tháng)"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Thông số kỹ thuật */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">
              Thông số kỹ thuật
            </Label>
            <Input
              placeholder="Kích thước màn hình (inch)"
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
            <Input
              placeholder="Tần số quét (Hz)"
              value={formData.specifications.refreshRate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    refreshRate: e.target.value,
                  },
                })
              }
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
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
            <Input
              placeholder="GPU"
              value={formData.specifications.gpu}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    gpu: e.target.value,
                  },
                })
              }
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="RAM (GB)"
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
            <Input
              placeholder="Bộ nhớ (GB)"
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
            <Input
              placeholder="Pin (Wh)"
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
            <Input
              placeholder="Bàn phím"
              value={formData.specifications.keyboard}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    keyboard: e.target.value,
                  },
                })
              }
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Cổng kết nối (phân cách bằng dấu phẩy)"
              value={formData.specifications.ports.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    ports: e.target.value.split(",").map((p) => p.trim()),
                  },
                })
              }
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Webcam"
              value={formData.specifications.webcam}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    webcam: e.target.value,
                  },
                })
              }
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Âm thanh"
              value={formData.specifications.audio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: {
                    ...formData.specifications,
                    audio: e.target.value,
                  },
                })
              }
              disabled={isLoading}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Kích thước */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">
              Kích thước (cm)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                placeholder="Chiều dài"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Input
                placeholder="Chiều rộng"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Input
                placeholder="Chiều cao"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Trọng lượng */}
          <div>
            <Label htmlFor="weight" className="text-gray-700 font-medium">
              Trọng lượng (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weight: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập trọng lượng"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
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
                  type="number"
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

          {/* Kết nối */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">Kết nối</Label>
            <div className="flex gap-2">
              <Input
                value={connectivityInput}
                onChange={(e) => setConnectivityInput(e.target.value)}
                placeholder="Nhập kết nối và nhấn Thêm"
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddConnectivity}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.connectivity.map((conn, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {conn}
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        connectivity: formData.connectivity.filter(
                          (_, i) => i !== index
                        ),
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

          {/* Phụ kiện */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">Phụ kiện</Label>
            <div className="flex gap-2">
              <Input
                value={accessoryInput}
                onChange={(e) => setAccessoryInput(e.target.value)}
                placeholder="Nhập phụ kiện và nhấn Thêm"
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleAddAccessory}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm
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
                    disabled={isLoading}
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
            onClick={handleAddLaptop}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Thêm laptop"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLaptopForm;
