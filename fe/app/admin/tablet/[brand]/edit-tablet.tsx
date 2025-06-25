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
import { Checkbox } from "@/components/ui/checkbox";
import { Tablet } from "@/lib/types/tablet";
import { apiPatch } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface EditTabletProps {
  tablet: Tablet;
  children: React.ReactNode;
}

const EditTablet = ({ tablet, children }: EditTabletProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: tablet.name || "",
    brand: tablet.brand || "",
    category: tablet.category || "",
    startingPrice: tablet.startingPrice || 0,
    promotion: tablet.promotion || 0,
    description: tablet.description || "",
    specifications: {
      screenSize: tablet.specifications.screenSize || 0,
      resolution: tablet.specifications.resolution || "",
      cpu: tablet.specifications.cpu || "",
      gpu: tablet.specifications.gpu || "",
      ram: tablet.specifications.ram || 0,
      storage: tablet.specifications.storage || 0,
      battery: tablet.specifications.battery || 0,
      os: tablet.specifications.os || "",
      refreshRate: tablet.specifications.refreshRate || "",
      cameraFront: tablet.specifications.cameraFront || "",
      cameraRear: tablet.specifications.cameraRear || "",
      simSupport: tablet.specifications.simSupport || false,
      stylusSupport: tablet.specifications.stylusSupport || false,
      ports: tablet.specifications.ports || [],
      audio: tablet.specifications.audio || "",
    },
    colorVariants: tablet.colorVariants.map((variant) => ({
      color: variant.color || "",
      image: null as File | null,
      stock: variant.stock || 0,
      existingImage: variant.image || "",
      hasNewImage: "false",
    })),
    weight: tablet.weight || 0,
    dimensions: {
      length: tablet.dimensions?.length || 0,
      width: tablet.dimensions?.width || 0,
      height: tablet.dimensions?.height || 0,
    },
    connectivity: tablet.connectivity || [],
    accessories: tablet.accessories || [],
    warranty: tablet.warranty || "",
    tags: tablet.tags || [],
    slug: tablet.slug || "",
    sku: tablet.sku || "",
  });
  const [imagePreview, setImagePreview] = useState<string[]>(
    tablet.colorVariants.map((variant) =>
      variant.image
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.image}`
        : ""
    )
  );
  const [tagInput, setTagInput] = useState("");
  const [connectivityInput, setConnectivityInput] = useState("");
  const [accessoryInput, setAccessoryInput] = useState("");

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  const handleUpdateTablet = async () => {
    setIsLoading(true);

    // Validation dữ liệu
    if (!formData.name.trim()) {
      toast.error("Tên máy tính bảng không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.brand.trim()) {
      toast.error("Thương hiệu không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.category.trim()) {
      toast.error("Danh mục không được để trống!");
      setIsLoading(false);
      return;
    }
    if (isNaN(formData.startingPrice) || formData.startingPrice <= 0) {
      toast.error("Giá gốc phải lớn hơn 0!");
      setIsLoading(false);
      return;
    }
    if (
      isNaN(formData.promotion) ||
      formData.promotion < 0 ||
      formData.promotion > 100
    ) {
      toast.error("Khuyến mãi phải từ 0 đến 100!");
      setIsLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Mô tả không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.warranty.trim()) {
      toast.error("Bảo hành không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.sku.trim()) {
      toast.error("SKU không được để trống!");
      setIsLoading(false);
      return;
    }
    if (
      !Array.isArray(formData.colorVariants) ||
      formData.colorVariants.length === 0 ||
      formData.colorVariants.some(
        (v) => !v.color.trim() || isNaN(v.stock) || v.stock < 0
      )
    ) {
      toast.error("Mỗi biến thể màu phải có tên và số lượng tồn kho hợp lệ!");
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
        JSON.stringify({
          ...formData.specifications,
          screenSize:
            parseFloat(formData.specifications.screenSize.toString()) || 0,
          ram: parseFloat(formData.specifications.ram.toString()) || 0,
          storage: parseFloat(formData.specifications.storage.toString()) || 0,
          battery: parseFloat(formData.specifications.battery.toString()) || 0,
        })
      );
      formDataToSend.append("weight", formData.weight.toString());
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataToSend.append(
        "connectivity",
        JSON.stringify(formData.connectivity.filter((c) => c.trim()))
      );
      formDataToSend.append(
        "accessories",
        JSON.stringify(formData.accessories.filter((a) => a.trim()))
      );
      formDataToSend.append("warranty", formData.warranty);
      formDataToSend.append(
        "tags",
        JSON.stringify(formData.tags.filter((t) => t.trim()))
      );
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("sku", formData.sku);

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
        formDataToSend.append(
          `colorVariants[${index}][hasNewImage]`,
          variant.hasNewImage
        );
        if (variant.image) {
          formDataToSend.append("images", variant.image);
        }
      });

      const response = await apiPatch<Tablet, FormData>(
        `/tablets/${tablet._id}`,
        formDataToSend
      );

      if (response.error) throw new Error(response.error);

      toast.success("Cập nhật máy tính bảng thành công!");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật máy tính bảng!");
    } finally {
      setIsLoading(false);
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
    setImagePreview([...imagePreview, ""]);
  };

  const removeColorVariant = (index: number) => {
    setFormData({
      ...formData,
      colorVariants: formData.colorVariants.filter((_, i) => i !== index),
    });
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleAddConnectivity = () => {
    if (
      connectivityInput.trim() &&
      !formData.connectivity.includes(connectivityInput.trim())
    ) {
      setFormData({
        ...formData,
        connectivity: [...formData.connectivity, connectivityInput.trim()],
      });
      setConnectivityInput("");
    }
  };

  const handleAddAccessory = () => {
    if (
      accessoryInput.trim() &&
      !formData.accessories.includes(accessoryInput.trim())
    ) {
      setFormData({
        ...formData,
        accessories: [...formData.accessories, accessoryInput.trim()],
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
            Chỉnh sửa Máy tính bảng: {tablet.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          {/* Tên */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Tên máy tính bảng
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên máy tính bảng"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Thương hiệu */}
          <div>
            <Label htmlFor="brand" className="text-gray-700 font-medium">
              Thương hiệu
            </Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              placeholder="Nhập thương hiệu"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
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
              placeholder="Nhập danh mục"
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
              type="text"
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
              placeholder="Nhập thời gian bảo hành"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug" className="text-gray-700 font-medium">
              Đường dẫn SEO (slug)
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="Nhập slug (ví dụ: ipad-pro-2024)"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* SKU */}
          <div>
            <Label htmlFor="sku" className="text-gray-700 font-medium">
              Mã hàng hóa (SKU)
            </Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              placeholder="Nhập mã SKU"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Thông số kỹ thuật */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">
              Thông số kỹ thuật
            </Label>

            <div className="flex items-center space-x-2">
              <Label
                htmlFor="screenSize"
                className="text-gray-700 font-medium  w-[20%]"
              >
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="resolution"
                className="text-gray-700 font-medium  w-[20%]"
              >
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
              <Label
                htmlFor="refreshRate"
                className="text-gray-700 font-medium  w-[20%]"
              >
                Tần số quét (Hz)
              </Label>
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
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="cpu"
                className="text-gray-700 font-medium  w-[20%]"
              >
                CPU
              </Label>
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
              <Label
                htmlFor="gpu"
                className="text-gray-700 font-medium w-[20%]"
              >
                GPU
              </Label>
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
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="ram"
                className="text-gray-700 font-medium  w-[20%]"
              >
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="storage"
                className="text-gray-700 font-medium  w-[20%]"
              >
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="battery"
                className="text-gray-700 font-medium  w-[20%]"
              >
                Pin (Wh)
              </Label>
              <Input
                placeholder="Pin (Wh)"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="os"
                className="text-gray-700 font-medium  w-[20%]"
              >
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
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="cameraFront"
                className="text-gray-700 font-medium  w-[20%]"
              >
                Camera trước
              </Label>
              <Input
                placeholder="Camera trước"
                value={formData.specifications.cameraFront}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      cameraFront: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="cameraRear"
                className="text-gray-700 font-medium  w-[20%]"
              >
                Camera sau
              </Label>
              <Input
                placeholder="Camera sau"
                value={formData.specifications.cameraRear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      cameraRear: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Label
                htmlFor="ports"
                className="text-gray-700 font-medium  w-[20%]"
              >
                Cổng kết nối
              </Label>
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
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="audio"
                className="text-gray-700 font-medium  w-[20%]"
              >
                Âm thanh
              </Label>
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="simSupport"
                checked={formData.specifications.simSupport}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      simSupport: !!checked,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300"
              />
              <Label htmlFor="simSupport" className="text-gray-700 font-medium">
                Hỗ trợ SIM
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stylusSupport"
                checked={formData.specifications.stylusSupport}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      stylusSupport: !!checked,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300"
              />
              <Label
                htmlFor="stylusSupport"
                className="text-gray-700 font-medium"
              >
                Hỗ trợ bút cảm ứng
              </Label>
            </div>
          </div>

          {/* Kích thước */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-4">
              Kích thước (mm)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label
                  htmlFor="length"
                  className="text-gray-700 font-medium mb-2"
                >
                  Chiều dài
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
                  disabled={isLoading}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="width"
                  className="text-gray-700 font-medium mb-2"
                >
                  Chiều rộng
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
                  disabled={isLoading}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="height"
                  className="text-gray-700 font-medium mb-2"
                >
                  Chiều cao
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
                  disabled={isLoading}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Trọng lượng */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label htmlFor="weight" className="text-gray-700 font-medium">
              Trọng lượng (kg)
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
              onClick={handleUpdateTablet}
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

export default EditTablet;
