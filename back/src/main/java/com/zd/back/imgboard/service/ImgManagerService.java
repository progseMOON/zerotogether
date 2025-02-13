package com.zd.back.imgboard.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zd.back.imgboard.model.Img;

 
@Service
public class ImgManagerService {
    
   @Value("${file.upload-dir}")
   private String uploadDir;
 //application.properties 에 있는 file 경로




   
    private final int MAX_IMAGE_COUNT = 3;  // 최대 이미지 개수
    private final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 최대 파일 크기 (10MB)



  //Upload=========================================================
    public List<Img> uploadImages(MultipartFile[] images, int imgPostId) throws IOException {
        // 1.디렉토리 확인 및 생성
        createUploadDirectory();

        // 2.파일 개수 검증
        validateImageCount(images.length);

        List<Img> imgList = new ArrayList<>();

        for (MultipartFile imgFile : images) {
            if (imgFile.isEmpty()) {
                throw new IllegalArgumentException("최소 1개 이상의 이미지 파일이 필요합니다.");
            }

            // 3.파일 사이즈 검증
            validateFileSize(imgFile.getSize());

            // 4.SaveFileName 지정 및 파일 저장
            String saveFileName = createUniqueFileName(imgPostId, imgFile.getOriginalFilename());
            saveImageFile(imgFile, saveFileName);

            // 5.Img 객체 생성 후 리스트에 추가
            imgList.add(createImgObject(imgFile, imgPostId, saveFileName));
        }

        return imgList;
    }

    // 1.디렉토리 확인 및 생성
    private void createUploadDirectory() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs(); // 디렉토리 생성
        }
    }

    // 2.파일 개수 검증
    private void validateImageCount(int count) {
        if (count > MAX_IMAGE_COUNT) {
            throw new IllegalArgumentException("이미지 파일은 최대 " + MAX_IMAGE_COUNT + "개까지 업로드할 수 있습니다.");
        }
    }

    // 3.파일 사이즈 검증
    private void validateFileSize(long fileSize) {
        if (fileSize > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("파일 크기는 최대 10MB까지 허용됩니다.");
        }
    }

     //4. SaveFileName 지정 및  파일 저장
    private String createUniqueFileName(int postId, String originalFilename) {
    
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');  //클라이언트의 orignalFileName에서 .이후만 추출 == 확장자
        if (dotIndex != -1 && dotIndex < originalFilename.length() - 1) {
            extension = originalFilename.substring(dotIndex);
        }
    
        // 확장자와 함께 고유한 파일 이름 생성
        return postId + "_" + UUID.randomUUID().toString() + extension;
    }
    
    private void saveImageFile(MultipartFile imgFile, String saveFileName) throws IOException {

        Path savePath = Paths.get(uploadDir, saveFileName);

        InputStream inputStream = null; 

        try {
            inputStream = imgFile.getInputStream(); 
            Files.copy(inputStream, savePath);

        } finally {
            if (inputStream != null) {
                
                    inputStream.close();  //닫아야함
              
            }
        }
    }

    //5.Img  객체 생성 후 반환 - 리스트에 추가 
    private Img createImgObject(MultipartFile imgFile, int imgPostId, String saveFileName) {
        Img img = new Img();
                
        //imgId 경우 sequence 로 설정 
        img.setImgPostId(imgPostId + 1);
        img.setOriginalFileName(imgFile.getOriginalFilename());
        img.setSaveFileName(saveFileName);
        img.setFilePath(Paths.get(uploadDir, saveFileName).toString());
        return img;
    }
//==============================================================================

        public void deleteImages( String fileName) {
            try {
                String filePath = uploadDir + File.separator + fileName;
                File f = new File(filePath);

                if (f.exists()) { // 파일이 있으면
                    f.delete(); // 물리적 파일 삭제
                }
            } catch (Exception e) {
                System.out.println(e.toString());
            }
        }







}
 