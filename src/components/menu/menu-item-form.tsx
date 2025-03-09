
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Utensils, BanknoteIcon, Image, FileText, Tag, Upload, X } from "lucide-react";
import { MenuItemFormData, MENU_CATEGORIES } from "@/types/menu-item";

interface MenuItemFormProps {
  initialData: MenuItemFormData;
  onSubmit: (data: MenuItemFormData, imageFile?: File) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function MenuItemForm({ initialData, onSubmit, onCancel, isSubmitting }: MenuItemFormProps) {
  const [formData, setFormData] = useState<MenuItemFormData>(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.image_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, imageFile || undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, price: isNaN(value) ? 0 : value }));
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_available: checked }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setImageFile(file);
    
    // Clear the image_url from formData since we'll use the uploaded file
    setFormData(prev => ({ ...prev, image_url: null }));
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, image_url: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" /> Item Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Chicken Burger"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="flex items-center gap-2">
            <BanknoteIcon className="h-4 w-4" /> Price (R) *
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handlePriceChange}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="flex items-center gap-2">
            <Tag className="h-4 w-4" /> Category
          </Label>
          <Select value={formData.category || ""} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {MENU_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Image className="h-4 w-4" /> Item Image
          </Label>
          <div className="flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            
            {previewUrl ? (
              <div className="relative w-full">
                <img 
                  src={previewUrl} 
                  alt="Menu item preview" 
                  className="h-[120px] w-full object-cover rounded-md border border-input"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-[120px] border-dashed flex flex-col gap-2"
                onClick={handleImageClick}
              >
                <Upload className="h-6 w-6" />
                <span>Upload Image</span>
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Describe your menu item..."
            className="min-h-[100px]"
          />
        </div>
        <div className="md:col-span-2 flex items-center space-x-2">
          <Switch
            id="is_available"
            checked={formData.is_available}
            onCheckedChange={handleAvailabilityChange}
          />
          <Label htmlFor="is_available" className="cursor-pointer">
            Available for ordering
          </Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Item"}
        </Button>
      </div>
    </form>
  );
}
