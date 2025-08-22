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
import { apiPatch } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { loadingStore } from "@/app/store/loading.store";
import { ITablet } from "@/lib/types/tablet";

const EditTablet = ({
  tablet,
  brands,
  children,
}: {
  tablet: ITablet;
  brands: string[];
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { start, stop } = loadingStore();
  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
  const [formData, setFormData] = useState({
    name: tablet.name || "",
    brand: tablet.brand || "",
    startingPrice: tablet.startingPrice || 0,
    promotion: tablet.promotion || 0,
    description: tablet.description || "",
    specifications: {
      screenSize: tablet.specifications?.screenSize || 0,
      resolution: tablet.specifications?.resolution || "",
      refreshRate: tablet.specifications?.refreshRate || 0,
      simType: tablet.specifications?.simType || "",
      ram: tablet.specifications?.ram || 0,
      storage: tablet.specifications?.storage || 0,
      battery: tablet.specifications?.battery || 0,
      os: tablet.specifications?.os || "",
      camera: {
        rear: tablet.specifications?.camera?.rear || "",
        front: tablet.specifications?.camera?.front || "",
      },
    },
    colorVariants: tablet.colorVariants.map((variant) => ({
      color: variant.color || "",
      image: null as File | null,
      stock: variant.stock || 0,
      existingImage: variant.image || "",
      hasNewImage: "false",
    })),
    dimensions: {
      length: tablet.dimensions?.length || 0,
      width: tablet.dimensions?.width || 0,
      height: tablet.dimensions?.height || 0,
      weight: tablet.dimensions?.weight || 0,
    },
    accessories: tablet.accessories || [],
    warranty: tablet.warranty || "",
    tags: tablet.tags || [],
  });
  const [imagePreview, setImagePreview] = useState<string[]>(
    tablet.colorVariants.map((variant) =>
      variant.image
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${variant.image}`
        : ""
    )
  );
  const [tagInput, setTagInput] = useState("");
  const [accessoryInput, setAccessoryInput] = useState("");

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  const handleUpdateTablet = async () => {
    start();

    // Validation dữ liệu
    if (!formData.name.trim()) {
      toast.error("Tên máy tính bảng không được để trống!");
      stop();
      return;
    }
    if (!formData.brand.trim()) {
      toast.error("Thương hiệu không được để trống!");
      stop();
      return;
    }
    if (isNaN(formData.startingPrice) || formData.startingPrice <= 0) {
      toast.error("Giá gốc phải lớn hơn 0!");
      stop();
      return;
    }
    if (
      isNaN(formData.promotion) ||
      formData.promotion < 0 ||
      formData.promotion > 100
    ) {
      toast.error("Khuyến mãi phải từ 0 đến 100!");
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
    if (
      !Array.isArray(formData.colorVariants) ||
      formData.colorVariants.length === 0 ||
      formData.colorVariants.some(
        (v) => !v.color.trim() || isNaN(v.stock) || v.stock < 0
      )
    ) {
      toast.error("Mỗi biến thể màu phải có tên và số lượng tồn kho hợp lệ!");
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
        JSON.stringify({
          ...formData.specifications,
          screenSize:
            parseFloat(formData.specifications.screenSize.toString()) || 0,
          refreshRate:
            parseFloat(formData.specifications.refreshRate.toString()) || 0,
          ram: parseFloat(formData.specifications.ram.toString()) || 0,
          storage: parseFloat(formData.specifications.storage.toString()) || 0,
          battery: parseFloat(formData.specifications.battery.toString()) || 0,
        })
      );
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataToSend.append(
        "accessories",
        JSON.stringify(formData.accessories.filter((a) => a.trim()))
      );
      formDataToSend.append("warranty", formData.warranty);
      formDataToSend.append(
        "tags",
        JSON.stringify(formData.tags.filter((t) => t.trim()))
      );

      formDataToSend.append(
        "colorVariants",
        JSON.stringify(
          formData.colorVariants.map((variant) => ({
            color: variant.color,
            stock: variant.stock,
            existingImage: variant.existingImage,
            hasNewImage: variant.hasNewImage,
          }))
        )
      );

      formData.colorVariants.forEach((variant) => {
        if (variant.image) {
          formDataToSend.append("images", variant.image);
        }
      });

      const response = await apiPatch<ITablet, FormData>(
        `/tablets/${tablet._id}`,
        formDataToSend,
        undefined,
        ["tablets"]
      );

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Cập nhật máy tính bảng thành công!");
        router.refresh();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error updating tablet:", error);
      toast.error("Có lỗi khi cập nhật máy tính bảng!");
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
    // Không cần connectivity trong tablet entity mới
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
        <div className="space-y-6">
          {/* Thông tin cơ bản */}
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
                  Tên máy tính bảng
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên máy tính bảng"
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
                          setFormData({ ...formData, brand: tablet.brand });
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

          {/* Thông số kỹ thuật */}
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium mb-2">
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Kích thước */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Kích thước và trọng lượng
            </h3>
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
            <h3 className="text-lg font-semibold text-gray-700">Phụ kiện</h3>
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
            <h3 className="text-lg font-semibold text-gray-700">Tags</h3>
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
              onClick={handleUpdateTablet}
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

export default EditTablet;
