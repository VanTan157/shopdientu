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
import { Laptop } from "@/lib/types/laptop";
import { apiPatch } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface EditLaptopProps {
  laptop: Laptop;
  children: React.ReactNode;
}

const EditLaptop = ({ laptop, children }: EditLaptopProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: laptop.name,
    brand: laptop.brand,
    category: laptop.category,
    startingPrice: laptop.startingPrice,
    promotion: laptop.promotion,
    description: laptop.description || "",
    specifications: {
      screenSize: laptop.specifications.screenSize || "",
      resolution: laptop.specifications.resolution || "",
      cpu: laptop.specifications.cpu || "",
      gpu: laptop.specifications.gpu || "",
      ram: laptop.specifications.ram || "",
      storage: laptop.specifications.storage || "",
      battery: laptop.specifications.battery || "",
      os: laptop.specifications.os || "",
      refreshRate: laptop.specifications.refreshRate || "",
      keyboard: laptop.specifications.keyboard || "",
      ports: laptop.specifications.ports || [],
      webcam: laptop.specifications.webcam || "",
      audio: laptop.specifications.audio || "",
    },
    colorVariants: laptop.colorVariants.map((variant) => ({
      color: variant.color,
      image: null as File | null,
      stock: variant.stock,
      existingImage: variant.image || "",
    })),
    weight: laptop.weight || 0,
    dimensions: {
      length: laptop.dimensions?.length || 0,
      width: laptop.dimensions?.width || 0,
      height: laptop.dimensions?.height || 0,
    },
    connectivity: laptop.connectivity || [],
    accessories: laptop.accessories || [],
    warranty: laptop.warranty || "",
    tags: laptop.tags || [],
  });
  const [imagePreview, setImagePreview] = useState([] as string[]);
  const [tagInput, setTagInput] = useState("");
  const [connectivityInput, setConnectivityInput] = useState("");
  const [accessoryInput, setAccessoryInput] = useState("");

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  const handleUpdateLaptop = async () => {
    setIsLoading(true);

    // Validate dữ liệu
    // Validate dữ liệu cơ bản
    if (!formData.name.trim()) {
      toast.error("Tên laptop không được để trống!");
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
    // Validate thông số kỹ thuật
    const specs = formData.specifications;
    if (!String(specs.screenSize).trim()) {
      toast.error("Kích thước màn hình không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!specs.resolution.trim()) {
      toast.error("Độ phân giải không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!specs.refreshRate.trim()) {
      toast.error("Tần số quét không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!specs.cpu.trim()) {
      toast.error("CPU không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!specs.gpu.trim()) {
      toast.error("GPU không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!String(specs.ram).trim()) {
      toast.error("RAM không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!String(specs.storage).trim()) {
      toast.error("Bộ nhớ không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!String(specs.battery).trim()) {
      toast.error("Pin không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!specs.os.trim()) {
      toast.error("Hệ điều hành không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!specs.keyboard.trim()) {
      toast.error("Bàn phím không được để trống!");
      setIsLoading(false);
      return;
    }
    if (
      !Array.isArray(specs.ports) ||
      specs.ports.length === 0 ||
      specs.ports.some((p) => !p.trim())
    ) {
      toast.error("Cổng kết nối không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!specs.webcam.trim()) {
      toast.error("Webcam không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!specs.audio.trim()) {
      toast.error("Âm thanh không được để trống!");
      setIsLoading(false);
      return;
    }
    // Validate kích thước
    if (
      isNaN(formData.dimensions.length) ||
      isNaN(formData.dimensions.width) ||
      isNaN(formData.dimensions.height) ||
      formData.dimensions.length <= 0 ||
      formData.dimensions.width <= 0 ||
      formData.dimensions.height <= 0
    ) {
      toast.error("Kích thước phải lớn hơn 0!");
      setIsLoading(false);
      return;
    }
    // Validate trọng lượng
    if (isNaN(formData.weight) || formData.weight <= 0) {
      toast.error("Trọng lượng phải lớn hơn 0!");
      setIsLoading(false);
      return;
    }
    // Validate biến thể màu
    if (
      !Array.isArray(formData.colorVariants) ||
      formData.colorVariants.length === 0 ||
      formData.colorVariants.some(
        (v) =>
          !v.color.trim() ||
          isNaN(v.stock) ||
          v.stock < 0 ||
          (!v.image && !v.existingImage)
      )
    ) {
      toast.error(
        "Mỗi biến thể màu phải có tên, ảnh (hoặc ảnh hiện tại), và số lượng tồn kho hợp lệ!"
      );
      setIsLoading(false);
      return;
    }
    // Validate kết nối
    if (
      !Array.isArray(formData.connectivity) ||
      formData.connectivity.some((c) => !c.trim())
    ) {
      toast.error("Kết nối không được để trống!");
      setIsLoading(false);
      return;
    }
    // Validate phụ kiện
    if (
      !Array.isArray(formData.accessories) ||
      formData.accessories.some((a) => !a.trim())
    ) {
      toast.error("Phụ kiện không được để trống!");
      setIsLoading(false);
      return;
    }
    // Validate tags
    if (!Array.isArray(formData.tags) || formData.tags.some((t) => !t.trim())) {
      toast.error("Tag không được để trống!");
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
        formDataToSend.append(
          `colorVariants[${index}][existingImage]`,
          variant.existingImage
        );
        if (variant.image) {
          formDataToSend.append("images", variant.image);
          formDataToSend.append(`colorVariants[${index}][hasNewImage]`, "true");
        }
      });

      const response = await apiPatch<Laptop, FormData>(
        `/laptops/${laptop._id}`,
        formDataToSend
      );

      if (response.error) throw new Error(response.error);

      toast.success("Cập nhật laptop thành công!");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật laptop!");
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
  };

  const removeColorVariant = (index: number) => {
    setFormData({
      ...formData,
      colorVariants: formData.colorVariants.filter((_, i) => i !== index),
    });
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] !max-w-[90%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chỉnh sửa laptop: {laptop.name}
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

          {/* Thông số kỹ thuật */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold">
              Thông số kỹ thuật
            </Label>
            <div className="flex items-center  space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Kích thước màn hình (inch)
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
              <Label className="text-gray-700 font-medium w-[20%]">
                Tần số quét (Hz)
              </Label>
              <Input
                placeholder="Tần số quét"
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
              <Label className="text-gray-700 font-medium w-[20%]">GPU</Label>
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
              <Label className="text-gray-700 font-medium w-[20%]">RAM</Label>
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
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Bộ nhớ
              </Label>
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
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">Pin</Label>
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
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Bàn phím
              </Label>
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
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
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
              <Label className="text-gray-700 font-medium w-[20%]">
                Webcam
              </Label>
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
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
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
          </div>

          {/* Kích thước */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <Label className="text-gray-900 font-semibold mb-4">
              Kích thước (cm)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-700 font-medium mb-2">
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
                <Label className="text-gray-700 font-medium mb-2">
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
                <Label className="text-gray-700 font-medium mb-2">
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
              onClick={handleUpdateLaptop}
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

export default EditLaptop;
