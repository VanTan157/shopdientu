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
import { Headphone } from "@/lib/types/headphone";
import { apiPatch } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface EditHeadphoneProps {
  headphone: Headphone;
  children: React.ReactNode;
}

const defaultSpecifications = {
  driverType: "",
  driverSize: 0,
  frequencyRange: "",
  sensitivity: 0,
  impedance: 0,
  noiseCancellation: "",
  batteryLife: 0,
  chargingTime: 0,
  chargingPort: "",
  microphone: "",
  audioQuality: "",
};

const EditHeadphone = ({ headphone, children }: EditHeadphoneProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: headphone.name,
    brand: headphone.brand,
    type: headphone.type,
    startingPrice: headphone.startingPrice,
    promotion: headphone.promotion,
    description: headphone.description || "",
    specifications: {
      ...defaultSpecifications,
      ...headphone.specifications,
    },
    colorVariants: headphone.colorVariants.map((variant) => ({
      color: variant.color,
      image: null as File | null,
      stock: variant.stock,
      existingImage: variant.image || "",
    })),
    weight: headphone.weight || 0,
    dimensions: {
      length: headphone.dimensions?.length || 0,
      width: headphone.dimensions?.width || 0,
      height: headphone.dimensions?.height || 0,
    },
    connectivity: headphone.connectivity || [],
    accessories: headphone.accessories || [],
    warranty: headphone.warranty || "",
    tags: headphone.tags || [],
    slug: headphone.slug || "",
    sku: headphone.sku || "",
  });
  const [imagePreview, setImagePreview] = useState<string[]>(
    headphone.colorVariants.map((variant) =>
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
      imagePreview.forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
    // eslint-disable-next-line
  }, []);

  const handleUpdateHeadphone = async () => {
    setIsLoading(true);

    // Validate dữ liệu cơ bản
    if (!formData.name.trim()) {
      toast.error("Tên tai nghe không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.brand.trim()) {
      toast.error("Thương hiệu không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.type.trim()) {
      toast.error("Loại tai nghe không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Đường dẫn SEO không được để trống!");
      setIsLoading(false);
      return;
    }
    if (!formData.sku.trim()) {
      toast.error("Mã hàng hóa không được để trống!");
      setIsLoading(false);
      return;
    }
    if (
      isNaN(Number(formData.startingPrice)) ||
      Number(formData.startingPrice) <= 0
    ) {
      toast.error("Giá gốc phải là số lớn hơn 0!");
      setIsLoading(false);
      return;
    }
    if (isNaN(Number(formData.promotion)) || Number(formData.promotion) < 0) {
      toast.error("Khuyến mãi phải là số không âm!");
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
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("type", formData.type);
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
        if (variant.image) {
          formDataToSend.append("images", variant.image);
          formDataToSend.append(`colorVariants[${index}][hasNewImage]`, "true");
        }
      });

      const response = await apiPatch<Headphone, FormData>(
        `/headphones/${headphone._id}`,
        formDataToSend
      );

      if (response.error) throw new Error(response.error);

      toast.success("Cập nhật tai nghe thành công!");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật tai nghe!");
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
            Chỉnh sửa tai nghe: {headphone.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          {/* Tên */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Tên tai nghe
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên tai nghe"
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

          {/* Loại tai nghe */}
          <div>
            <Label htmlFor="type" className="text-gray-700 font-medium">
              Loại tai nghe
            </Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              placeholder="Nhập loại tai nghe"
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
              placeholder="Nhập đường dẫn SEO"
              disabled={isLoading}
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="Nhập mã hàng hóa"
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
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Loại driver
              </Label>
              <Input
                placeholder="Loại driver"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Kích thước driver (mm)
              </Label>
              <Input
                placeholder="Kích thước driver (mm)"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Dải tần số (Hz)
              </Label>
              <Input
                placeholder="Dải tần số (Hz)"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Độ nhạy (dB)
              </Label>
              <Input
                placeholder="Độ nhạy (dB)"
                type="number"
                value={formData.specifications.sensitivity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      sensitivity: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Trở kháng (Ohms)
              </Label>
              <Input
                placeholder="Trở kháng (Ohms)"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Công nghệ chống ồn
              </Label>
              <Input
                placeholder="Công nghệ chống ồn"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Thời lượng pin (giờ)
              </Label>
              <Input
                placeholder="Thời lượng pin (giờ)"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Thời gian sạc (giờ)
              </Label>
              <Input
                placeholder="Thời gian sạc (giờ)"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Loại cổng sạc
              </Label>
              <Input
                placeholder="Loại cổng sạc"
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
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Loại micro
              </Label>
              <Input
                placeholder="Loại micro"
                value={formData.specifications.microphone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      microphone: e.target.value,
                    },
                  })
                }
                disabled={isLoading}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-gray-700 font-medium w-[20%]">
                Chất lượng âm thanh
              </Label>
              <Input
                placeholder="Chất lượng âm thanh"
                value={formData.specifications.audioQuality}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specifications: {
                      ...formData.specifications,
                      audioQuality: e.target.value,
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
              Trọng lượng (gram)
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
              onClick={handleUpdateHeadphone}
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

export default EditHeadphone;
